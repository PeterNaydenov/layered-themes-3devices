# 3Devices engine for "Layered-themes"

Theme engine provides 3 devices set of CSS rules (mobile, tablet, and desktop).

```
  - 0px                   - mobile (500px)             - hq (1000px)
 |                       |                            |
 o --------------------- o -------------------------- o --------------------
            |                           |                         |
       mobile theme               tablet theme                 desktop theme

```

You can change borders, themes, folder names and media queries ruls. 3Devices engine is controlled by config file.


## Installation
Make sure that 'Layered Themes' framework is already installed. If not install it by:

```
npm install grunt-layered-themes --save-dev
```

Install 3Devices theme engine:
```
npm install layered-themes-3devices --save-dev
```

Make sure that 'Layered Themes' framework is accessible in 'gruntfile.js':
```js
grunt.loadNpmTasks('grunt-layered-themes');
```

Add grunt configuration lines:
```js
layered_themes : {
                      task : {
                                options : {
                                              configFile : '_config.json'
                                            , src        : 'css-dev'
                                            , target     : 'css'
                                        } ,
                           }
```
 - **src**: your development folder. Contain all CSS theme folders;
 - **target**: framework will write result in this folder
 - **configFile**: path to specific engine configuration file. Engine name, resolutions and theme organization are set into it.

Configuration file is simple 'json' file and here is the minimal content needed:
 
 ```json
{
    "engine"       : "layered_themes_3devices"
  , "resolution"   : { 
	  				    "mobile" : "500" 
	  				  , "hq"     : "1000" 
	  		       }
  , "themes"       : { 
	  				     "default" : "desk"
	  			   }
}
 ```
Engine attribute contains name of the theme engine or link to your custom engine file.
Installation complete!









## Infrastructure
**Note**: The example files will have '.css' extension but could be whatever other CSS preprocessor related ones. ( less, scss , sass, stly, other )
### Source
Provide folder with your themes. In our example case it will be **css-dev** folder. Content of 'css-dev' looks like this:

```
css-dev
   |
   |
   |- other|
   |       |-other.css
   |
   |
   |- mini |
   |       |-maxi.css
   |       |-mini-something.css
   |
   |- mid  |
   |       |-maxi.css
   |       |-maxi-touch.css
   |
   |- maxi |
           |-maix.css
           |-maxi-header.css
           |-maxi-footer.css
           |-contact.css
           |-contact-form.css
```

Three themes - mini, mid, and maxi. If theme default is 'maxi' then we have 2 keys: main,contact. 



### Target
Result folder will look like this:
```
|-mobile|
|       |-main.css
|
|-tablet|
|       |-main.css
|
|
|-desktop|
         |-main.css
         |-contact.css
```
**Mobile** target folder will contain our only mobile rules. All rules related to tablets and desktop are completly ignored. No media queries applied.

**Tablet** folder will have same content as mobile if they are using same theme. Otherwise media query (**MQ**) will separate mobile and tablet rules. From 0 to 'mobile' for 'mobile' rules and from 'mobile' to infinity for 'tablet' rules. Desktop rules are not available in this folder.

**Desktop** target will have same content as mobile if all three devices are using same theme.

 - If desktop and tablet are using same theme, then we will have MQ from 0 to 'mobile' resolution border for mobile rules and MQ from mobile border to infinity for all other rules;
 - If tablet and mobile are using same theme: MQ for 0 to HQ border for mobile theme and MQ from HQ to infinity for desktop rules;
 - If mobile, tablet and desktop use different themes then MQ from 0 to mobile resolution border will contain mobile rules, MQ from mobile to HQ will contain tablet rules, and MQ from HQ to infinity will contain desktop rules.



### Configuration file
Simple 'JSON' file as in the example above.









## Settings
All theme engine settings are provided by configuration file. Here is the list of all options provided:

```json
{
    "engine"       : "layered_themes_3devices"
  , "resolution"   : { 
	  				    "mobile" : "500" 
	  				  , "hq"     : "1000" 
	  		       }
  , "folders"      : [ "mob", "tab", "desk" ]
  , "themes"       : { 
	  				     "default" : "desk"
	  				    , "tablet" : "mini"
	  				    , "mobile" : "mini"
	  			   } 
  , "expand"      : {}
  , "include"     : {}
  , "extra"       : {}

}
```

###Engine (required)
This field is required. It provides theme engine to the framework.



### Resolution ( required)
Define media queries (MQ) in our result files. Mobile devices will work from 0 to 500px. Tablets are between 501px and 1000px. Desktop devices are above 1001px. Change them according your specific design needs.



### Folders (optional)
Rename folders in your target folder by setting 'folders'. It's array of 3 strings. First for mobile rules, second - tablet rules, third - desktop. Folders have default values of 
```json
["mobile","tablet","desktop"]
```



### Themes (required)
Only "themes.default" is required actually. Default theme is responsible for keys and adds information where is not set.



Examples:

**Simple**
```json
 "themes" : { "default" : "desk" } 
```
Provides for all devices 'desk' theme.



** Mobile and [ Tablet, Desk] **
```json
 "themes" : { 
 			  "default" : "desk" 
              ,"mobile" : "mini" 
            } 
```
Mobile devices will use theme 'mini'. Tablet and desktop are not set. They will use theme 'default'. In this case it's 'desk'.



** Mobile , Tablet, and Desktop **
```json
 "themes" : { 
 			  "default" : "desk" 
              ,"tablet" : "mid" 
              ,"mobile" : "mini" 
            } 
```
Mobile devices will use theme 'mini'. Tablet will use 'mid' theme. Desktop will use theme 'desk' because 'desk' is default.

** [Mobile,Tablet] and Desktop **
```json
 "themes" : { 
 			  "default" : "desk" 
              ,"tablet" : "mini" 
              ,"mobile" : "mini" 
            } 
```
Mobile devices and tablets will use theme 'mini'. Desktop will use 'desk'.


### expand (optional)
Remember how themes works? In desktop version mobile rules are closed between 0px and mobile(500px). Do you want to make this rules available to other themes?
```
  - 0px                   - mobile (500px)             - hq (1000px)
 |                       |                            |
 o --------------------- o -------------------------- o --------------------
            |                           |                         |
       mobile theme               tablet theme                 desktop theme

```
It's possible by using extend option.

```json
"extend" : { "mobile" : 1 }
```

- before extend mobile MQ : 0-mobile(500px);
- after extend mobile MQ : 0-hq(1000px);

Other example:
```json
"extend" : { "mobile" : 2 }
```
 - before - 0-mobile(500px);
 - after - no MQ for these rules;
 
Let's see other situation :
```json
"extend" : { "mobile" : 1 , "tablet" : 1 }
```
 - Mobile rules are available to tablet. MQ interval 0 - hq(1000px);
 - Tablet rules are available to desktop. MQ interval mobile(500px) - infinity;

What if we have rules from desktop version and on some reason we want to make them available to all other devices. It's not a good practice but sometimes happen. You can do it by:
```json
"extend" : { "desktop" : 0 }
```

Let's summarize: Extend with N mean to add N MQ intervals to your standard MQ. If number is higher then available intervals mean that rules are available to all intervals above. To remove the MQ extend with 0 (zero).


### include (optional)
Include files or libraries per device type.
```json
"include" :  { 
				 "default" : ["everywhere.less, more.less"] 
                , "tablet" : ["allTabletFiles.less"]
                , "desktop": ["deskOnly.less"]
             }
```
Default will import content to all type of devices. Include this files in all files available. Tablet will include content only for tablet devices. Desktop files will include "deskOnly.less" file.


### extra (optional)
Include in device,key. Example:
```json
"extra"  : { 
				  "default,main" : ["mainEverywhere.less"]
                , "desktop,main" : ["onlyMainInDesktop.less", "oneMore.less"]
           } 
```
 - First will add to all devices, main key - "@import mainEverywhere.less"
 - Second will add to "desktop", main key - "@import onlyMainDesktop.less" and "@import oneMore.less" 






