+++
title = "Creating a simple synthesizer VST plugin in Rust"
date = 2018-01-03

[taxonomies]
topics = ["Synthesizers", "Tutorials"]
crates = ["vst"]
contributors = ["doomy"]
+++

> This article was sourced from [vaporsoft.net](https://vaporsoft.net/creating-an-audio-plugin-with-rust-vst/)

Welcome to 2018!  A lot happened this past year - the most important of which being the 0.0.1 release of [`vst`](https://crates.io/crates/vst) on Crates.io.

# Preface
If you know what you're looking for (e.g., if you came here from a Google search) and you're antsy to get into code, just go ahead and skip to the bits where we start coding.  Or read the notes that I slaved away at writing.  Up to you. 

## About
`vst` is a crate that implements the VST 2.4 specification by Steinberg.  VSTs (Virtual Studio Technology) are audio plugins used in a variety of applications.  Its basic features are as follows:

- [MIDI](https://en.wikipedia.org/wiki/MIDI) input and output
- Effects processing
- Audio synthesis

If you're here from a Google search, chances are you already know this.  You also probably know of other solutions like JUCE, DPlug, or wdl-ol.  If you're thinking "Oh boy! Finally, I can ditch C++ for Rust!" - I like your enthusiasm, but the `vst` crate isn't quite there yet!  It's not much of a framework, and instead just lets you interact with MIDI notes and an audio buffer.  It also doesn't have proper UI support yet.  But hey, it's 0.0.1 - give us some time. 

You may have also stumbled on Joe Clay's excellent post, [Writing an Audio Plugin in Rust](https://www.seventeencups.net/posts/writing-an-audio-plugin-in-rust/).  Their post and this post are similar, and I'll address that below.

## vst2 or vst?
In Joe's aforementioned example, they use [overdrivenpotato's vst2 crate](https://www.seventeencups.net/posts/writing-an-audio-plugin-in-rust/).  Unfortunately, this repository has been stagnant for quite some time due to having only one contributor.  

[`vst`](https://github.com/rust-dsp/rust-vst) is a fork of the original [`vst2`](https://github.com/overdrivenpotato/rust-vst2/) source, with a community of developers and maintainers keeping the project active.  

TL;DR, you'll want to use the `vst` crate, and not the `vst2` crate.  It sounds counterintuitive, but just roll with it.

## Disclaimer
I'm not a professional in the DSP field.  Some of the stuff I do might not be best practice or the most efficient.  However, I hope I'm qualified enough to make a "getting started" tutorial.  I hope you think the info I provide is valuable.  

# What we'll be building
We'll be creating a monophonic white-noise generator.  In layman's terms, we're going to create a thing that makes *whooooooshhhh* noises, and that thing can only make one noise at a time.  

# Setting up
Let's get started.  Set up a new project the same way you would for any other crate.  Let's call our VST "whisper", because of the whooshing noises.

<div class='filename'>
  <div>Console</div>
</div>

```
cargo new whisper
```

After that, we need to add our `vst` dependency, as well as specify that our crate type is "cdylib".  It should look like this:

<div class='filename'>
  <div>Cargo.toml</div>
</div>

```toml
[package]
name = "whisper"
version = "0.1.0"
authors = ["myname <myemail@example.com>"]

[dependencies]
vst = "0.0.1"
# if you aren't following this tutorial to a T, and a newer version
# has been released, you might wish to get the crate directly
# off of our official Github repository like this:
# vst = { git = "https://github.com/rust-dsp/rust-vst" }

[lib]
name = "whisper"
crate-type = ["cdylib"]
```

Next, lets add some basic boilerplate code to get our minimal VST up and running.

<div class='filename'>
  <div>src/lib.rs</div>
</div>

```rust
// `vst` uses macros, so we'll need to specify that we're using them!
#[macro_use]
extern crate vst;

use vst::plugin::{Info, Plugin};

#[derive(Default)]
struct Whisper;

// We're implementing a trait `Plugin` that does all the VST-y stuff for us.
impl Plugin for Whisper {
    fn get_info(&self) -> Info {
        Info {
            name: "Whisper".to_string(),

            // Used by hosts to differentiate between plugins.
            // Don't worry much about this now - just fill in a random number.
            unique_id: 1337, 

            // For now, fill in the rest of our fields with `Default` info.
            ..Default::default()
        }
    }
}

// Make sure you call this, or nothing will happen.
plugin_main!(Whisper); 
```

If you don't really know what's going on right now, don't worry.  Basically, we're implementing the `Plugin` trait for our `Whisper` struct.  This `Plugin` trait contains all the info we need to comply with the VST standard in a struct aptly named `Info`.

# Full `Info` struct options
Right now, we're filling in our `Info` struct with mostly default options.  But there's a lot of stuff we can change to tell our host what our plugin does and expects.  We can find full options in the [`plugin.rs` file](https://github.com/rust-dsp/rust-vst/blob/master/src/plugin.rs).

- `name` - The name of our plugin as a `String`
- `vendor` - The creator (e.g. company) of our plugin as a `String`
- `presets` - The number of presets as an `i32`.  We can safely ignore this for now, and if you don't know what a preset is, don't worry.
- `inputs` - The number of audio inputs as an `i32`.  This has a default of `2` (one for the left channel, one for the right).  Since we're creating a synthesizer that requires no inputs, we'll set this to `0` later.
- `outputs` - The number of audio outputs as an `i32`.  This again has a default of `2`.  This makes sense for our application which will output stereo audio.  If we were building a surround-sound white-noise-ear-blaster, we would want to change this.
- `unique_id` - This is required, but [kind of pointless](https://www.kvraudio.com/forum/viewtopic.php?t=397199).
- `version` - pretty self explanatory.  This is saved as an i32, but you can still do semantic versioning.  For example, a value of `0001` would be the equivalent of version `0.0.0.1`.  `1234` would be the equivalent of version `1.2.3.4`.
- `category` - This is an [enum](https://rust-dsp.github.io/rust-vst/vst/plugin/enum.Category.html) that specifies the category of the plugin, which is used in some DAWs.  We're making a `Category::Synth`, which means we're going to create an output.  If we made a `Category::Effect`, we might process inputs and modify their buffer.
- `initial_delay`, `preset_chunks`, `f64_precision`, `silent_when_stopped` - don't worry about these right now!

# Revising our `Info`
Now that we know a little more about what we want to build, let's revisit our `lib.rs` file.

<div class='filename'>
  <div>src/lib.rs</div>
</div>

```rust
// `vst` uses macros, so we'll need to specify that we're using them!
#[macro_use]
extern crate vst;

# note that we've added the `Category` enum for use in our `Info` struct.
use vst::plugin::{Info, Plugin, Category};

#[derive(Default)]
struct Whisper;

// We're implementing a trait `Plugin` that does all the VST-y stuff for us.
impl Plugin for Whisper {
    fn get_info(&self) -> Info {
        Info {
            name: "Whisper".to_string(),

            // Used by hosts to differentiate between plugins.
            unique_id: 1337, 

            // We don't need inputs
            inputs: 0,

            // We do need two outputs though.  This is default, but let's be 
            // explicit anyways.
            outputs: 2,

            // Set our category
            category: Category::Synth

            // We don't care about other stuff, and it can stay default.
            ..Default::default()
        }
    }
}

plugin_main!(Whisper); 
```

# Testing our bare-bones plugin

> If you're already familiar with VST hosts, and how to load plugins, feel free to skip this part.  

We're going to need a way to test our VST plugins.  It's not as easy as running `cargo run`, though, because VSTs are `.dll`s.  They need to be run inside of a VST host.  If you use a DAW (Digital Audio Workstation), chances are you already have a VST host.  Ableton Live, FL Studio, and Logic are a few popular examples.  If you already have a VST host, look in your use manual on how to add VSTs or VST search directories.  

If you don't have a VST host, go ahead and use the aptly named [VST host](http://www.hermannseib.com/english/vsthost.htm).  I'm going to be using VST host for all future examples in this tutorial.  

## Building and loading our plugin
Believe it or not, we already have something we can compile and load into a host.  Go ahead and build your project.

<div class='filename'>
  <div>Console</div>
</div>

```
cargo build
```

If all goes well, you should have a successful build.  A file named `whisper.dll` should be present in your `target/debug` directory.  This is our VST file.

Go ahead and open VST Host, and drag our `whisper.dll` file onto the main window. It should look something like this.

![](/images/creating-an-audio-plugin-with-rust/vsthost1.jpg)

A bit underwhelming?  Well, it shouldn't be!  You just created your first VST plugin in Rust.  It doesn't do anything, but it loads!  

Notice in VST Host that a single greenish node connects with the output.  This is the (stereo) audio output, like we defined in our `Info` struct.  

# Actually doing something
Right now, our plugin does nothing.  Let's change that, and create some white noise to fill our audio buffer.

> Warning: What we're making can be loud, and right now, it won't be controlled by anything.  It'll just be always on, which is a bit unpleasant.  Turn your volume down before you forget.

Our `Plugin` trait has a few other functions - the most notable being `process`.  This is where we'll do a bunch of stuff with our audio buffer.

White noise is another name for random noise.  In other words, it's just a bunch of random samples from `-1.0` to `1.0`.  So to achieve white noise, we want to fill our `AudioBuffer` with, well, random noise.

Let's take a look back at our `lib.rs` file, and define a new function.  

<div class='filename'>
  <div>src/lib.rs</div>
</div>

```rust
// after our `get_info` function
// ...

fn process(&mut self, buffer: &mut AudioBuffer<f32>) {

    // `buffer.split()` gives us a tuple containing the 
    // input and output buffers.  We only care about the
    // output, so we can ignore the input by using `_`.
    let (_, output_buffer) = buffer.split();

    // Now, we want to loop over our output channels.  This
    // includes our left and right channels (or more, if you
    // are working with surround sound).
    for output_channel in output_buffer.into_iter() {
        // Let's iterate over every sample in our channel.
        for output_sample in output_channel {
            // For every sample, we want to add a random value from
            // -1.0 to 1.0.
            *output_sample = 0f32;
        }
    }
}

// ...
```

Let's build, compile, and load this new plugin.  Prepare your ears for the deafening sound of... nothing.  Every sample is `0`!  We're just outputting silence.  Let's fix this.

> Note: if you're getting a weird error compiling, make sure you close the plugin in whatever host you have it open in, as the file might not be overwritten due to it being in use.

# Adding white noise
Rust doesn't have a random library built in, so we'll need to add another dependency.  Let's modify our `Cargo.toml` file to remedy this.





<div class='filename'>
  <div>Cargo.toml</div>
</div>

```toml
# ...

[dependencies]
vst = "0.0.1"
rand = "0.3"

# ...
```

Now let's modify our main file to add random values from `-1.0` to `1.0` to our buffer.

<div class='filename'>
  <div>src/lib.rs</div>
</div>

```rust
// `vst` uses macros, so we'll need to specify that we're using them!
#[macro_use]
extern crate vst;
extern crate rand;

use vst::plugin::{Info, Plugin, Category};
use vst::buffer::AudioBuffer;
use rand::random;

#[derive(Default)]
struct Whisper;

// We're implementing a trait `Plugin` that does all the VST-y stuff for us.
impl Plugin for Whisper {
    fn get_info(&self) -> Info {
        Info {
            name: "Whisper".to_string(),

            // Used by hosts to differentiate between plugins.
            unique_id: 1337, 

            // We don't need inputs
            inputs: 0,

            // We do need two outputs though.  This is default, but let's be 
            // explicit anyways.
            outputs: 2,

            // Set our category
            category: Category::Synth,

            // We don't care about other stuff, and it can stay default.
            ..Default::default()
        }
    }

    fn process(&mut self, buffer: &mut AudioBuffer<f32>) {
        
        // `buffer.split()` gives us a tuple containing the 
        // input and output buffers.  We only care about the
        // output, so we can ignore the input by using `_`.
        let (_, output_buffer) = buffer.split();

        // Now, we want to loop over our output channels.  This
        // includes our left and right channels (or more, if you
        // are working with surround sound).
        for output_channel in output_buffer.into_iter() {
            // Let's iterate over every sample in our channel.
            for output_sample in output_channel {
                // For every sample, we want to add a random value from
                // -1.0 to 1.0.
                *output_sample = (random::<f32>() - 0.5f32) * 2f32;
            }
        }
    }
}

plugin_main!(Whisper); 
```

Notice the additional crate and `use` statement at the top of the file.

You might be wondering what the weird math does.  
`*output_sample = (random::<f32>() - 0.5f32) * 2f32;` looks weird, right?  What's with the extra operations? 

Well, our `random` function gives us a number between `0.0` and `1.0`, instead of `-1.0` and `1.0` like we want.  By subtracting `0.5` and then multiplying by `2.0`, we can get our desired result.

## Performance
This method is poorly optimized, due to calling the `random` function for every sample.  This tutorial won't delve into optimization, but if you want to look at a possible solution, check out [this example](https://github.com/resamplr/rsynth/blob/master/examples/test_synth.rs).

When building other plugins, be sure to test and/or distribute your builds with the [`--release`](https://doc.rust-lang.org/cargo/guide/creating-a-new-project.html) flag.  This turns on certain optimizations that will help your plugin be more performant, at the cost of longer build times.

# Adding events
If you build and test your synth now, you'll see that it outputs horrible white noise, *all of the time*.  Most VST instruments respond to MIDI input, e.g. notes on a piano.  Instead of having our instrument produce noise all the time, let's make it so it only produces noise when a note is pressed.

> Note: If you're using VST Host, you can play MIDI notes by hooking up the MIDI node and playing notes on the keyboard (which can be enabled on the top bar).

Because our instrument is unpitched, we don't care about *what* note is playing.  We just want to make sure sound is playing as long as there is a note being pressed.  We can do this quite simply  by adding 1 to a counter whenever we receive a `note_on` event, and subtracting 1 from the counter whenever a `note_off` event is received.  

> Note: White noise is unpitched.  No matter what note plays, the waveform will look the same.  That's not necessarily true for all synthesizers, so keep in mind that the following solution will not be appropriate for all instruments.  Our solution is also not very robust and is prone to breaking if our VST Host doesn't perform perfectly.  However, it's a good introduction to events.

We're making a big change to the code, but it'll be our last for now.  Let's go through the whole thing, and document changes through comments.

<div class='filename'>
  <div>src/lib.rs</div>
</div>

```rust
#[macro_use]
extern crate vst;
extern crate rand;

use vst::plugin::{Info, Plugin, Category};
use vst::buffer::AudioBuffer;
use vst::event::Event;
use vst::api::Events;
use rand::random;

#[derive(Default)]
struct Whisper {
    // We added a counter in our plugin struct.  
    // Thanks to Mathias Lengler for a correction in this code.
    notes: u8
}

// We're implementing a trait `Plugin` that does all the VST-y stuff for us.
impl Plugin for Whisper {
    fn get_info(&self) -> Info {
        Info {
            name: "Whisper".to_string(),

            // Used by hosts to differentiate between plugins.
            unique_id: 1337, 

            // We don't need inputs
            inputs: 0,

            // We do need two outputs though.  This is default, but let's be 
            // explicit anyways.
            outputs: 2,

            // Set our category
            category: Category::Synth,

            // We don't care about other stuff, and it can stay default.
            ..Default::default()
        }
    }

    // Here's the function that allows us to receive events
    fn process_events(&mut self, events: &Events) {

        // Some events aren't MIDI events - so let's do a match
        // to make sure we only get MIDI, since that's all we care about.
        for event in events.events() {
            match event {
                Event::Midi(ev) => {

                    // Check if it's a noteon or noteoff event.
                    // This is difficult to explain without knowing how the MIDI standard works.
                    // Basically, the first byte of data tells us if this signal is a note on event
                    // or a note off event.  You can read more about that here: 
                    // https://www.midi.org/specifications/item/table-1-summary-of-midi-message
                    match ev.data[0] {

                        // if note on, increment our counter
                        144 => self.notes += 1u8,

                        // if note off, decrement our counter
                        128 => self.notes -= 1u8,
                        _ => (),
                    }
                    // if we cared about the pitch of the note, it's stored in `ev.data[1]`.
                },
                // We don't care if we get any other type of event
                _ => (),
            }
        }
    }

    fn process(&mut self, buffer: &mut AudioBuffer<f32>) {
        // We only want to process *anything* if a note is
        // being held.  Else, we can return early and skip
        // processing anything!
        if self.notes == 0 { return }
        
        // `buffer.split()` gives us a tuple containing the 
        // input and output buffers.  We only care about the
        // output, so we can ignore the input by using `_`.
        let (_, output_buffer) = buffer.split();

        // Now, we want to loop over our output channels.  This
        // includes our left and right channels (or more, if you
        // are working with surround sound).
        for output_channel in output_buffer.into_iter() {
            // Let's iterate over every sample in our channel.
            for output_sample in output_channel {
                // For every sample, we want to add a random value from
                // -1.0 to 1.0.
                *output_sample = (random::<f32>() - 0.5f32) * 2f32;
            }
        }
    }
}

plugin_main!(Whisper); 
```

> Note: Some VST Hosts implement software MIDI keyboards slightly differently!  Rather than sending a 128 "note-off" when a key is released, they send a 144 "note-on" with the velocity (ev.data[2]) set to 0.

Build and compile our code, and your plugin should work wonderfully.  It'll only create the horrible harsh white-noise when a key is being held.  We can also mash down a bunch of keys at once without stopping generating sound.  

Please again note that this is a *very* rudimentary system, and it's very specific to our use case.

# Takeaways and source code
Hopefully by now you have a rough understanding of how to create VSTs and modify audio buffers in Rust.  In the future, I hope to expound on certain subjects, like creating controls or creating effects.

The source code can be found [on Github here](https://github.com/resamplr/rust-noise-vst-tutorial).

# Fixes
If you find an issue with the above code, let me know.  The best way is to [open an issue](https://github.com/resamplr/rust-noise-vst-tutorial/issues/new) on the example repository.  
Thanks to: 

- [Mathias Lengler](https://github.com/MathiasLengler) for their [fix](https://www.reddit.com/r/rust/comments/7o1qnp/creating_a_simple_synthesizer_vst_plugin_in_rust/ds6hm82/?utm_content=permalink&utm_medium=front&utm_source=reddit&utm_name=rust) regarding an unnecessary usage of `Cell`.

- [Adolfo Ochagavía](https://github.com/aochagavia) for [their insight](https://github.com/resamplr/vaporsoft/pull/1) in adding the `--release` flag to cargo builds to further optimize code. 

- [Alex Zywicki](https://github.com/zyvitski) for their [fix](https://github.com/resamplr/rust-noise-vst-tutorial/commit/810e9f4640ee28530bba1fe19d5d6ef12fec134f) for refactoring the code without the need for an input buffer.

# Extra resources
If you're totally sold on building VSTs with Rust, check out [the official Rust VST Telegram chat](https://tinyurl.com/ya5ff5ef).  We're a friendly community who are eager to advise new users and help maintain better code.   

If you're coming from something like JUCE and miss the abstraction, check out my [rsynth](https://github.com/resamplr/rsynth) project.  It helps abstract a lot of what we did in this tutorial with stuff like voice managers.  Note that it's super-alpha-in-development-broken code and needs a lot of work, but at least check out the examples.

# Next time
In the future, we'll create more complex applications, like a multi-voice tonal synth with band-limited sawtooth waves.  We'll also explore how to create a minimal GUI within Rust VST using your host's built in controls.  

# Contacting me
You can reach me on Mozilla's Rust IRC at `doomy` or `_doomy`.  You can also add me on telegram [@piedoomy](https://t.me/piedoomy), where I'm most certain to respond.
