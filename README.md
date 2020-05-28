# Ramsetti
Tetris clone created while learning web development at Ramsalt Lab AS  

The clone is created based on a JS tutorial by freeCodeCamp on Youtube.  

# How to play
Put all files in its own folder and open index.html in a web browser.  

# Version info
The app is currently being developed.  
The settings are not supposed to resemble a real game yet. Levels are shorter to allow for quicker testing.  

# Issues
-No option to move or rotate once a piece has touched another piece.  
-Some timing issues can result in overlapping pieces.  
-High scores not implemented yet.  
-Scoring algorithm doesn't award playing at higher speeds enough.  
-The background image had not been added to the repo.  
-Instructions can be clearer.  

# Currently prioritized issues
-Include JQuery in project.  

# Solved issues
-Removed duplicate css code by using the same classes on elements that should share styles.  
-Cleaned up and commented css file according to advice.  
-Fixed flexbox adjustment hack by removing the unwanted element and using flex-basis instead.  
-Fixed JS to hide/show all siblings when toggling How to play button. TODO: Try doing this with JQuery.  
-Changed flex-direction and order on small devices to get a one column setup with the game board near the top.  
-Changed flex-direction in the footer for the same reason.  
-Set game area to a fixed width of 360 pixels.  
-Adjusted the breakpoint to be at 900px (multi-column to one-column).  
-Changed "How to" from a button to a clickable h2 styled as a button. Changed some other styles to align it more with the general design.  
-The pieces now have different colors, and they keep that color after landing.  
-The game over message is now its own paragraph to avoid messing up the layout.  
-The scoring algorithm has been fixed to prevent decimal values. This depends on not altering the score and gamespeed related constants in the JS file.  
-After a tip, all elements now have (global) border-box styling except the next box.  
-Changed all measures to use rem except those that depend on the size and number of squares or thin (1px) borders.  
