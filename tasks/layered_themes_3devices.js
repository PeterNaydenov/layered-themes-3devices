/*
 * grunt-layered-themes-3devices
 * https://github.com/peternaydenov/grunt-layered-themes-3devices
 *
 * Plugin for 'Layer-themes' CSS theme engine.
 *
 * Copyright (c) 2015 Peter Naydenov
 * Licensed under the MIT license.
 */

'use strict';

module.exports = {



start : function ( options ) {
// Apply engine logic and return saveConfig object

   var 
          config = options.config
        , themes = config.themes
        , expand
        , saveConfig = {}
        , setting = 'default'
        , mobile , tablet , desktop
        , change = false
        , error  = []
        ;


// if folders are not set use default values - mobile, tablet, desktop;
if ( !config.folders || config.folders.length == 0 ) config.folders = [ 'mobile', 'tablet' , 'desktop'];

expand = ( 'expand' in config ) ? config.expand : false;

      // set saveConfig file function.
      ( function () { 
                        var el = JSON.stringify ({
                                                        content : { inherit  : 'default' }
                                                      , include : { inherit  : 'default' }
                                                      , extra   : { inherit  : 'default' }
                                                });


                    saveConfig['default'] = {
                                                  content : {}
                                                , include : {}
                                                , extra   : {}
                                            };

                    config.folders.forEach ( function ( name , index ) { 
                            saveConfig[name] = JSON.parse(el);
                            if ( index == 0 ) saveConfig[name]['content']['default'] = [ { mobile : '-'} ];
                            if ( index == 1 ) saveConfig[name]['content']['default'] = [ 
                                                                                             { mobile : '-mobile'}
                                                                                           , { tablet : 'mobile-'}
                                                                                        ];
                            if ( index == 2 ) saveConfig[name]['content']['default'] = [
                                                                                             { mobile  : '-mobile'}
                                                                                           , { tablet  : 'mobile-hq'}
                                                                                           , { desktop : 'hq-'}
                                                                                       ];
                    });

      })(); // set saveConfig func.



// fulfil configuration;
if ( !themes.mobile    ) themes.mobile  = config.themeDefault.name;
if ( !themes.tablet    ) themes.tablet  = config.themeDefault.name;
if ( !themes.desktop   ) themes.desktop = config.themeDefault.name;

// describe setting
if ( themes.mobile == themes.tablet && themes.tablet == themes.desktop ) setting = 'oneTheme';
if ( themes.mobile == themes.tablet && themes.tablet != themes.desktop ) setting = 'tabAsMobile';  
if ( themes.mobile != themes.tablet && themes.tablet == themes.desktop ) setting = 'tabAsDesktop';



( function () { 
// setting cases
                  var 
                        dMobile  = options.config.folders[0]
                      , dTablet  = options.config.folders[1]
                      , dDesktop = options.config.folders[2]
                      ;

switch ( setting ) {
// 'setting' and 'config.extend' add modifications to saveConfig;
          case 'oneTheme'    : 
                                for ( var folder in saveConfig ) {
                                                                    saveConfig[folder]['content']['default'] = [ { desktop : '-'} ];
                                }
                                break; 

          case 'tabAsMobile'  :
                                mobile = { 'mobile' : '-hq'};
                                desktop = {'desktop' : 'hq-'};

                                if ( expand.mobile == 0 || expand.mobile > 1 || expand.tablet >= 0 ) {
                                // if mobile or tablet expand
                                                                                // in 'tabAsMobile' mobile and tablet are using same content
                                                                                change = true;
                                                                                mobile = { 'mobile' : '-' };
                                                           } 
                                if ( expand.desktop == 0 ) {
                                // if desktop expand
                                                                               change = true; 
                                                                               desktop = {'desktop' : '-'}; 
                                                           } 
                                
                                saveConfig[dTablet]['content']['default'] = saveConfig[dMobile]['content']['default'];
                                saveConfig[dDesktop]['content']['default'] = [ mobile, desktop ];
                                break;

          case 'tabAsDesktop' :
                                mobile =  { 'mobile'  : '-mobile' };
                                tablet =  { 'desktop' : 'mobile-' };
                                
                                if ( expand.mobile  >= 0 ) { change = true; mobile = { 'mobile' : '-'} }
                                if ( expand.tablet  == 0 ) { change = true; tablet = { 'desktop': '-'} }
                                if ( expand.desktop == 0 ) { change = true; tablet = { 'desktop': '-'} }

                                saveConfig[ dTablet  ]['content']['default'] = [ mobile , tablet ];
                                saveConfig[ dDesktop ]['content']['default'] = [ mobile , tablet ];
                                break;

                     default : 
                              mobile  = { 'mobile'  : '-mobile'   }
                              tablet  = { 'tablet'  : 'mobile-hq' }
                              desktop = { 'desktop' : 'hq-'       }
                              
                              if ( expand.mobile  == 0 ) { change = true; mobile  = { 'mobile'  : '-'      }; }
                              if ( expand.mobile  == 1 ) { change = true; mobile  = { 'mobile'  : '-hq'    }; }
                              if ( expand.mobile  >= 2 ) { change = true; mobile  = { 'mobile'  : '-'      }; }
                              if ( expand.tablet  == 0 ) { change = true; tablet  = { 'tablet'  : '-'      }; }
                              if ( expand.tablet  >= 1 ) { change = true; tablet  = { 'tablet'  : 'mobile-'}; }
                              if ( expand.desktop == 0 ) { change = true; desktop = { 'desktop' : '-'      }; }

                              saveConfig[ dDesktop ]['content']['default'] = [ mobile , tablet , desktop  ];
     } // switch setting
})(); // setting cases





// include update
 if ( 'include' in config ) {
                               for ( var locate in config.include ) {
                                    ( function (loc) {
                                          var place;

                                          switch ( loc ) {
                                                case 'default': place='default';
                                                                break;
                                                case 'mobile' : 
                                                                place = options.config.folders[0];   
                                                                break;
                                                case 'tablet' : 
                                                                place = options.config.folders[1];  
                                                                break;
                                                case 'desktop' : 
                                                                place = options.config.folders[2];  
                                                                break;
                                                       default : return;
                                               } // switch split[0]

                                          saveConfig[ place ]['include']['default'] = config.include[loc];

                                    })(locate);
                               }

 if ( error.length > 0 ) return error;

} // if include in config





// extra update
if ( 'extra' in config ) {
                        for ( var locate in config.extra ) {
                                    ( function (loc) {
                                          var 
                                                split = loc.split(',');

                                          split[0] = split[0].trim();
                                          split[1] = split[1].trim();

                                          if ( split.length != 2 ) { 
                                                                      error.push ( 'Wrong "include" configuration --> ' + loc + '. \nConfig file: ' + options.configFile );
                                                                      return;
                                                                    }
                                          
                                          switch ( split[0]) {
                                                case 'default': split[0] = 'default'
                                                                break;
                                                case 'mobile' : 
                                                                split[0] = options.config.folders[0];   
                                                                break;
                                                case 'tablet' : 
                                                                split[0] = options.config.folders[1];  
                                                                break;
                                                case 'desktop' : 
                                                                split[0] = options.config.folders[2];  
                                                                break;
                                                       default : return;
                                               } // switch split[0]

                                          saveConfig[ split[0] ]['extra'][ split[1] ] = config.extra[loc];

                                    })(locate);
                               }

 if ( error.length > 0 ) return error;    
} // extra update



options.saveConfig = saveConfig;
options.MQcomment  = {
                          'mobile-'   : 'tablet and desktop'
                        , '-mobile'   : 'mobile'
                        , 'mobile-hq' : 'tablet'
                        , '-hq'       : 'mobile and tablet'
                        , 'hq-'       : 'desktop'
                     }

return false;
} // start func.

}; // module


