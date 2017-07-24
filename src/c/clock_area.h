#pragma once
#include <pebble.h>

typedef enum {
  FONT_SETTING_DEFAULT = 0,
  FONT_SETTING_BOLD    = 1,
  FONT_SETTING_BOLD_H  = 2,
  FONT_SETTING_BOLD_M  = 3
} FontSetting;

// "public" functions
void ClockArea_init(Window* window);
void ClockArea_deinit();
void ClockArea_redraw();
void ClockArea_update_time(struct tm* time_info);
