var CONFIG_VERSION = 8;
// var BASE_CONFIG_URL = 'http://localhost:4000/';
var BASE_CONFIG_URL = 'http://freakified.github.io/TimeStylePebble/';

// Listen for when the watchface is opened
Pebble.addEventListener('ready',
  function(e) {
    console.log('JS component is now READY');
  }
);

// Listen for incoming messages
// when one is received, we simply assume that it is a request for new weather data
Pebble.addEventListener('appmessage',
  function(msg) {
    console.log('Recieved message: ' + JSON.stringify(msg.payload));
  }
);

Pebble.addEventListener('showConfiguration', function(e) {
  var bwConfigURL    = BASE_CONFIG_URL + 'config_bw.html';
  var colorConfigURL = BASE_CONFIG_URL + 'config_color.html';
  var roundConfigURL = BASE_CONFIG_URL + 'config_color_round.html';
  var dioriteConfigURL = BASE_CONFIG_URL + 'config_diorite.html';

  var versionString = '?appversion=' + CONFIG_VERSION;

  if(Pebble.getActiveWatchInfo) {
    try {
      watch = Pebble.getActiveWatchInfo();
    } catch(err) {
      watch = {
        platform: "basalt"
      };
    }
  } else {
    watch = {
      platform: "aplite"
    };
  }

  if(watch.platform == "aplite"){
    Pebble.openURL(bwConfigURL + versionString);
  } else if(watch.platform == "chalk") {
    Pebble.openURL(roundConfigURL + versionString);
  } else if(watch.platform == "diorite") {
    Pebble.openURL(dioriteConfigURL + versionString);
  } else {
    Pebble.openURL(colorConfigURL + versionString);
  }
});

Pebble.addEventListener('webviewclosed', function(e) {
  var configData = decodeURIComponent(e.response);

  if(configData) {
    configData = JSON.parse(decodeURIComponent(e.response));

    console.log("Config data recieved!" + JSON.stringify(configData));

    // prepare a structure to hold everything we'll send to the watch
    var dict = {};

    // color settings
    if(configData.color_bg) {
      dict.SettingColorBG = parseInt(configData.color_bg, 16);
    }

    if(configData.color_sidebar) {
      dict.SettingColorSidebar = parseInt(configData.color_sidebar, 16);
    }

    if(configData.color_time) {
      dict.SettingColorTime = parseInt(configData.color_time, 16);
    }

    if(configData.sidebar_text_color) {
      dict.SettingSidebarTextColor = parseInt(configData.sidebar_text_color, 16);
    }

    // general options
    if(configData.language_id !== undefined) {
      dict.SettingLanguageID = configData.language_id;
    }

    if(configData.leading_zero_setting) {
      if(configData.leading_zero_setting == 'yes') {
        dict.SettingShowLeadingZero = 1;
      } else {
        dict.SettingShowLeadingZero = 0;
      }
    }

    if(configData.clock_font_setting) {
      if(configData.clock_font_setting == 'default') {
        dict.SettingClockFontId = 0;
      } else if(configData.clock_font_setting == 'leco') {
        dict.SettingClockFontId = 1;
      } else if(configData.clock_font_setting == 'bold') {
        dict.SettingClockFontId = 2;
      } else if(configData.clock_font_setting == 'bold-h') {
        dict.SettingClockFontId = 3;
      } else if(configData.clock_font_setting == 'bold-m') {
        dict.SettingClockFontId = 4;
      }
    }

    // bluetooth settings
    if(configData.disconnect_icon_setting) {
      if(configData.disconnect_icon_setting == 'yes') {
        dict.SettingDisconnectIcon = 1;
      } else {
        dict.SettingDisconnectIcon = 0;
      }
    }

    if(configData.bluetooth_vibe_setting) {
      if(configData.bluetooth_vibe_setting == 'yes') {
        dict.SettingBluetoothVibe = 1;
      } else {
        dict.SettingBluetoothVibe = 0;
      }
    }

    // notification settings
    if(configData.hourly_vibe_setting) {
      if(configData.hourly_vibe_setting == 'yes') {
        dict.SettingHourlyVibe = 1;
      } else if (configData.hourly_vibe_setting == 'half') {
        dict.SettingHourlyVibe = 2;
      } else {
        dict.SettingHourlyVibe = 0;
      }
    }

    // sidebar settings
    dict.SettingWidget0ID = configData.widget_0_id;
    dict.SettingWidget1ID = configData.widget_1_id;
    dict.SettingWidget2ID = configData.widget_2_id;

    if(configData.sidebar_position) {
      if(configData.sidebar_position == 'right') {
        dict.SettingSidebarOnLeft = 0;
      } else {
        dict.SettingSidebarOnLeft = 1;
      }
    }

    if(configData.use_large_sidebar_font_setting) {
      if(configData.use_large_sidebar_font_setting == 'yes') {
        dict.SettingUseLargeFonts = 1;
      } else {
        dict.SettingUseLargeFonts = 0;
      }
    }

    // battery widget settings
    if(configData.battery_meter_setting) {
      if(configData.battery_meter_setting == 'icon-and-percent') {
        dict.SettingShowBatteryPct = 1;
      } else if(configData.battery_meter_setting == 'icon-only') {
        dict.SettingShowBatteryPct = 0;
      }
    }

    if(configData.autobattery_setting) {
      if(configData.autobattery_setting == 'on') {
        dict.SettingDisableAutobattery = 0;
      } else if(configData.autobattery_setting == 'off') {
        dict.SettingDisableAutobattery = 1;
      }
    }

    if(configData.altclock_name) {
      dict.SettingAltClockName = configData.altclock_name;
    }

    if(configData.altclock_offset !== null) {
      dict.SettingAltClockOffset = parseInt(configData.altclock_offset, 10);
    }

    if(configData.decimal_separator) {
      dict.SettingDecimalSep = configData.decimal_separator;
    }

    console.log('Preparing message: ', JSON.stringify(dict));

    // Send settings to Pebble watchapp
    Pebble.sendAppMessage(dict, function(){
      console.log('Sent config data to Pebble');
    }, function() {
        console.log('Failed to send config data!');
    });
  } else {
    console.log("No settings changed!");
  }

});
