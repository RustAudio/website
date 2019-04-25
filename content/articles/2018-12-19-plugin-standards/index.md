+++
title = "Plugin Standards Explained"
date = 2019-04-12

[taxonomies]
topics = ["plugins"]
contributors = ["robsaunders", "doomy"]
+++

Many plugin standards exist, and separate versions of each interface can be very different.  As these standards further fragment, creating a plugin can become more and more confusing. Here, we will briefly describe common audio plugin standards.

## VST ( Proprietary, Steinberg)
VST is the most common standard, and contains several versions.
The two most used versions - VST2x and VST3 - are very different from one another.  VST3 was released in 2008, but still lacks support from a majority of DAWs.  VST2x versions are simpler to implement in other languages.  The standard is widely supported across DAWs, so VST2x is a logical choice.

There is currently only one maintained and published VST implementation, which is our very own [`vst`](https://crates.io/crates/vst).

## AudioUnit (Proprietary, Apple)
AudioUnit is only available on Apple platforms. AU v2 is simlar to VST from a practical and development standpoint.  AU v3 follows an Apple framework approach, which is harder to implement without Apple tools.

Currently, no Rust libraries implement the AudioUnit standard. However, there are several resources on the topic:

- [Rust CoreAudio - AudioUnit struct documentation](http://rustaudio.github.io/coreaudio-rs/coreaudio/audio_unit/struct.AudioUnit.html)
- [Rust CoreAudio - Possibility of creating AU plugins](https://github.com/RustAudio/coreaudio-rs/issues/52)
- [Rust CoreAudio - AudioUnit implementation](https://github.com/RustAudio/coreaudio-rs/blob/master/src/audio_unit/mod.rs)
- [DPlug - AudioUnit implemented in DLang](https://github.com/AuburnSounds/Dplug/tree/master/au/dplug/au)

## LV2 (Free / Open Source)
While having a promising design, LV2 is only supported by very few, open source or Linux oriented DAWs.

It's most unique feature is to store general information about the plugin in configuration files instead of the binary, which makes the standard very extensible.

Currently, there is no production-ready crate for plugin creation, but there are several prototypes:

- [`lv2`](https://crates.io/crates/lv2)
- [`lv2rs`](https://crates.io/crates/lv2rs)
- [`lv2-rs`](https://gitlab.com/prokopyl/lv2-rs)

Further reading:
- [LV2 Crate implementation and Design on rust.audio](http://rust-audio.discourse.group/t/lv2-crate-implementation-and-design/71/2)
- [Giving an Overview about LV2](http://rust-audio.discourse.group/t/giving-an-overview-about-lv2/70/11)

## Conclusion
Permissive licensing is always good news for our projects. We believe standards should be free, open, and free from corporate interests.  The culture of proprietary audio software holds back the audio industry as a whole! 
