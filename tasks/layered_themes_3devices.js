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
        ;

expand = ( 'expand' in config ) ? config.expand : false;

saveConfig = {

                  default : {
                                content  : {}
                              , include  : {}
                              , extra    : {}
                          } ,
                  mobile  : {
                                content  : { 
                                              'default' : [  { mobile : '-'}  ]
                                         }
                              , include  : { }
                              , extra    : { }
                          } ,
                  tablet  : {
                                content  : {
                                              'default' : [
                                                              { mobile    : '-mobile' }
                                                            , { tablet    : 'mobile-' }
                                                          ]
                                         }
                              , include  : {}
                              , extra    : {}
                          } ,
                  desktop : {
                                content  : {
                                              'default' : [
                                                                { mobile  : '-mobile'}
                                                              , { tablet  : 'mobile-hq'}
                                                              , { desktop : 'hq-'}
                                                          ]
                                          }
                              , include  : {}
                              , extra    : {}
                          }
} // saveConfig


// fulfil configuration;
if ( !themes.mobile    ) themes.mobile  = config.themeDefault.name;
if ( !themes.tablet    ) themes.tablet  = config.themeDefault.name;
if ( !themes.desktop   ) themes.desktop = config.themeDefault.name;

// describe setting
if ( themes.mobile == themes.tablet && themes.tablet == themes.desktop ) setting = 'oneTheme';
if ( themes.mobile == themes.tablet && themes.tablet != themes.desktop ) setting = 'tabAsMobile';  
if ( themes.mobile != themes.tablet && themes.tablet == themes.desktop ) setting = 'tabAsDesktop';


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
                                
                                saveConfig['tablet' ]['content']['default'] = saveConfig['mobile']['content']['default']
                                if ( change ) saveConfig['desktop']['content']['default'] = [ mobile, desktop ];
                                break;

          case 'tabAsDesktop' :
                                mobile =  { 'mobile'  : '-mobile' };
                                tablet =  { 'desktop' : 'mobile-' };
                                
                                if ( expand.mobile  >= 0 ) { change = true; mobile = { 'mobile' : '-'} }
                                if ( expand.tablet  == 0 ) { change = true; tablet = { 'desktop': '-'} }
                                if ( expand.desktop == 0 ) { change = true; tablet = { 'desktop': '-'} }

                                if ( change ) {
                                                            saveConfig['tablet' ]['content']['default'] = [ mobile , tablet ];
                                                            saveConfig['desktop']['content']['default'] = [ mobile , tablet ];
                                }
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

                              if ( change ) saveConfig['desktop']['content']['default'] = [ mobile , tablet , desktop  ];
     } // switch setting



options.saveConfig = saveConfig;
options.MQcomment  = {
                          'mobile-'   : 'tablet and desktop'
                        , '-mobile'   : 'mobile'
                        , 'mobile-hq' : 'tablet'
                        , '-hq'       : 'mobile and tablet'
                        , 'hq-'       : 'desktop'
                     }

} // start func.

}; // module