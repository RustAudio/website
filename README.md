# Rust Audio

This repository contains the code powering https://rust.audio. This website contains information on audio development with the Rust programming language.

Please note this site has no affiliation with the [RustAudio](https://github.com/RustAudio) group on GitHub.

## Basic Details

This repository uses the [Zola static site generator](https://github.com/Keats/gutenberg). Please check [here](//getzola.org/documentation/getting-started) for basic Zola documentation.

## Conventions

1. Casing
   - All user-facing terms and text (topics) must have proper capitalization.
   - Internal names are lower snake cased.
   - Topics should be plural when nouns
   - Examples:
     - The topic `DSP` is all caps, since it is user-facing
     - The taxonomy `topics` is lowercase, since it is internal
     - The topic `Synthesizers` is capitalized and pluralized, since it is a user-facing noun.
2. Content Layout
   - All articles should be named `index.md` and be contained within a dated folder following the format `YYYY-MM-DD-{name}`
   - All filename spaces should be dashes
   - All readable articles go into the `articles` section
   - Each article has the [`article` style front-matter](#articles-format)
3. Contributors
   - These include anyone who helped write or edit the article
   - Each contributor has a page in the `contributors` section directory.
   - The file should be lowercase, space-dashed, and contain no special punctuation characters. This can be a real name or a username
   - Each contributor has the [`contributor` style front-matter](#contributors-format)

## Site Layout

This site has several main [taxonomies](//www.getzola.org/documentation/content/taxonomies/).  They are:

1. `topics`
2. `crates`
3. `contributors`

### 1. Topics

This taxonomy classifies higher-level topics, similar to tags. Examples of topics in this taxonomy include `DSP`, `Plugins` `Synthesizers` or `Tutorials`

Articles for this term are tagged when their subject matter is included in a broader topic. Try to include at least one topic for greater visibility and organization.

### 2. Crates

This taxonomy is populated with the actual crate name of each associated crate.

Articles for this term are tagged when their subject matter directly deals with the crate in question. For example, "How to use the `lv2` crate" would tag the `lv2` crate taxonomy term.

Please note that the exact crate name must be targeted as data will be pulled from the crates.io API.

### 3. Contributors

This taxonomy contains all those who helped make this website possible.

Articles for this term are tagged when an author needs to be specified, or when credit is given to a substantial revision.

## Page Layouts

### Articles Format

```toml
+++
# Titles are the user-facing names of articles
# Titles should be written like a sentence (no 
# title capitalization) without a period at the end
title = "Creating a simple synthesizer VST plugin in Rust"

# The date can include the time as well. It does not include
# the time the article was updated.
date = 2018-01-03

# This table lets us associate terms with this article
[taxonomies]
topics = ["Synthesizers", "Tutorials"]
# (Optional) This article uses the `vst` crate
crates = ["vst"]
# This article was written by `doomy`. We need to make sure
# that every contributor has a page in `contributors`, else
# we will recieve a build error.
contributors = ["doomy"]

[extra]
# (Optional) Not currently used, but in the future it will 
# display. Use this to specify the last time an article was 
# updated.Please note that big changes to an article should 
# be documented in the body of the article itself.
updated = 2019-01-03
+++

All Markdown here will be the article body!
```

### Contributors Format

```toml
+++
# The "real" name of this user. This can be the same as 
# their username, or completely different. For example,
# a contributor file named `azel15i` might instead
# have the title `Robert Peterson`. It is up to the
# contributor.
title = "doomy"
# At what day this contributor file was added.
date = 2019-04-13
[extra]
# (Optional) The GitHub username associated with this 
# contributor, if any.
github = "piedoom"
+++

(Optional) A bio of this contributor can go here.
```