+++
title = "Plugin Standards Explained"
date = 2019-04-12

[taxonomies]
topics = ["Plugins"]
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
While promising, LV2 is only supported on Linux except for a few other open source DAWs.

All plugin hosts and plugin implementations are backwards compatible with previous versions.  In other words, plugins implemented with a new version can also use an old version.  Additionally, plugins implemented with a new version can also load in older DAWs. While the older plugin standard lacks some nice features <sup>[[which features?]](https://github.com/rust-dsp/rust-vst/wiki/Plugin-Standards/_edit)</sup>, many still use it.

There are a few LV2 implementations in Rust, with confusingly similar names:

- [`lv2`](https://crates.io/crates/lv2)
- [`lv2rs`](https://crates.io/crates/lv2rs)
- [`lv2-rs`](https://gitlab.com/prokopyl/lv2-rs)

Further reading:
- [LV2 Crate implementation and Design on rust.audio](http://rust-audio.discourse.group/t/lv2-crate-implementation-and-design/71/2)

## Conclusion
Permissive licensing is always good news for our projects. We believe standards should be free, open, and free from corporate interests.  The culture of proprietary audio software holds back the audio industry as a whole! 
