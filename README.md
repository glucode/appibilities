# Glucode Appibilities
![appibilities](https://user-images.githubusercontent.com/159896/161737295-0acb5411-98b8-432e-ad99-064e35c3a9b6.jpg)

Appibilities is an iOS Accessibility Assistant for Sketch that guides and assists designers in
creating interfaces that can be enjoyed by everyone.

## Rules

### Font Type and Weight

San Francisco and New York fonts have specific rules when used in designs. To help you, you'll get
alerted when they're used incorrectly. These are the checks the Assistant runs:

- Font weight is one of 'Regular', 'Medium', 'Semibold', or 'Bold'.
- For text layers using the 'San Francisco' font, font family is set to 'Display' for text larger
  than 20 points.
- For text layers using the 'New York' font, font family is set to
  - 'Small' for text smaller than 20 points.
  - 'Medium' for text between 20 and 35 points.
  - 'Large' for text between 36 and 53 points.
  - 'ExtraLarge' for text larger than 54 points.

### Artboards

Sometimes an Artboard gets mistakingly resized during the design process. Appibilities helps you
keep your Artboards in check.

### Ellipsis

Incompleted sentences can cause experience issues. We'll help you make sure that users always have a
way to access information that doesn't quite fit the screen.

### Hotspots

Small tap areas can cause frustration for people using your app. So Appibilities will guide you in
making sure that all interaction points have a minimum tappable area of 44×44pts.

This rule will make sure all tappable layers have a minimum size of 44×44pts.

(_Tappable layers_ include any Hotspots, elements with a prototyping target, and Symbol Instances
whose name contains "action", "button", "btn, "cta", "icon" or "link".)
