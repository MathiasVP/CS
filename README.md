CS
==
Counter-Strike 1.6 implementation in JavaScript utilizing state of the art browser APIs.

<i>Please note: I am no longer (and have not been for a long time) hacking on this project. Some stuff may still work, some stuff may not work!</i>

<b>Current state</b>
<ul>
<li>Parses and renders .bsp files (version 30) containing map data</li>
<li>Parses and renders .mdl files (version 10) with textures </li>
<li>Camera movement, yaw and pitch fully implemented</li>
<li>Collision detection implemented</li>
<li>Naive gravity implemented</li>
</ul>

<b>Getting started</b><br />
The following files are needed in the root of the project for the game to load:
- data/maps/cs_assault.bsp
- data/models/v_m3.mdl
- data/player/arctic/arctic.mdl
- data/sounds/weapons/m3-1.wav
- data/sprites/weapon_m3.txt

All of which can be found in your local installation of Counter Strike 1.6 if downloaded off Steam.
Please note: Don't just go and fetch these files from the first hit on Google or the likes - most of these models will be modified versions which won't be parsed successfully.

<b>Hacking on the codebase</b><br />
<ul>
<li>A fully updated version of Chrome is recommended when hacking around in the code. (Firefox not yet supported)</li>
<li>When debugging locally use the Chrome flag: "--allow-file-access-from-files" so that Chrome can load data files from the local file system.</li>
</ul>

<b>Commiting changes</b><br />
<ul>
<li>Please note: No actual data (maps, models, textures, etc.) is included in the project, due to copyright reasons!</li>
</ul>

![Screenshot](http://i.imgur.com/9kMVte7.png)
