IMPORTANT
---------

This public repo acts as hosting for the Full Circle of Indigenous Educators Resource Library. 

Any modifications to this repo could impact the live app on the partners site. Please check 
before making any changes here as it could affect the partners website. 

Jonathon Forbes & Jon Donais were the Animikii stakeholders on this project, so you might
want to check in with them first before making changes here. 
 
How to deploy the app.
---------------------

1. Run 'npm run build', copy `dist/index.js` and `dist/index.css` to `/cdn/resource_library.js` & 
   `/cdn/resource_library.css` respectively 
2. Commit and Push the code up to github.
3. Go to JS delivr and click 'specific git commit hash'
   (link - https://www.jsdelivr.com/package/gh/JonCSGuy/Full-Circle-of-Indigenous-Educators-Resource-Library)
4. Log into the client's wordpress, and under Appearance/Themes/Theme Editor/FullCircle theme/functions.php
   update the 'resource-library-script' URL and point it to the updated resource loader script link you 
   got from JS delivr. Click 'update file' when you are done editing.
5. Changes should be live on the client site at https://fullcircleindigenous.ca/ under the resource library page.

How to run the app on your local
-------------------------------

`npm run start`

The docker compose is if you want to mess around with setting up a local wordpress to test on.
