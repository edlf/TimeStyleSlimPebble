#pragma once
#include <pebble.h>

#define FONT_SETTING_DEFAULT 0
#define FONT_SETTING_BOLD    1
#define FONT_SETTING_BOLD_H  2
#define FONT_SETTING_BOLD_M  3

// "public" functions
void ClockArea_init(Window* window);
void ClockArea_deinit();
void ClockArea_redraw();
void ClockArea_update_time(struct tm* time_info);
