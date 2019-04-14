+++
title = "Plugin Standards"
date = 2019-04-12
tags = ["rust", "audio", "vst"]

[taxonomies]
topics = ["plugins"]
contributors = ["robsaunders"]
+++

Many plugin standards exist, and separate versions of each interface can be very different.  As these standards further fragment, creating a plugin can become more and more confusing.

## VST ( Proprietary, Steinberg)
VST is the most common standard, and contains several versions.
The two most used versions - VST2x and VST3 - are very different from one another.  VST3 was released in 2008, but still lacks support from a majority of DAWs.  VST2x versions are simpler to implement in other languages.  The standard is widely supported across DAWs, so VST2x is a logical choice.

## AudioUnit (Proprietary, Apple)
AudioUnit is only available on Apple platforms. AU v2 is simlar to VST from a practical and development standpoint.  AU v3 follows an Apple framework approach, which is harder to implement without Apple tools.

## LV2 (Free / Open Source)
While promising, LV2 is only supported on Linux except for a few other open source DAWs.

All plugin hosts and plugin implementations are backwards compatible with previous versions.  In other words, plugins implemented with a new version can also use an old version.  Additionally, plugins implemented with a new version can also load in older DAWs. While the older plugin standard lacks some nice features <sup>[[which features?]](https://github.com/rust-dsp/rust-vst/wiki/Plugin-Standards/_edit)</sup>, many still use it.

This is good for projects like rust-vst.  We believe standards should be free, open, and free from corporate interests.  The culture of proprietary audio software holds back the audio industry as a whole!

Since rust-vst is a VST2x implementation, we are currently focused on a VST GUI library.  However, the presented information can apply to many plugin types.