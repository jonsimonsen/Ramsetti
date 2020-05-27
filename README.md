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
-How to prevent gamearea from growing too much when increasing window width.  
-Include JQuery in project.  

# Solved issues
-Removed duplicate css code by using the same classes on elements that should share styles.  
-Cleaned up and commented css file according to advice.  
-Fixed flexbox adjustment hack by removing the unwanted element and using flex-basis instead.  
-Fixed JS to hide/show all siblings when toggling How to play button. TODO: Try doing this with JQuery.  
-Changed flex-direction and order on small devices to get a one column setup with the game board near the top.  
