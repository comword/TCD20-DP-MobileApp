// Ref: https://github.com/sixo/native-camera/blob/master/app/src/main/cpp/log.h
#ifndef SIXO_LOG_H_
#define SIXO_LOG_H_

#include <android/log.h>

#define S(x) #x
#define S_(x) S(x)
#define S__LINE__ S_(__LINE__)

#if defined(NDEBUG)

#define LOGI(...) ((void)0)
#define LOGD(...) ((void)0)
#define LOGW(...) ((void)0)
#define LOGE(...) ((void)0)

#else

#define LOGI(...) (__android_log_print(ANDROID_LOG_INFO, __func__, __VA_ARGS__))
#define LOGD(...) (__android_log_print(ANDROID_LOG_DEBUG, __func__, __VA_ARGS__))
#define LOGW(...) (__android_log_print(ANDROID_LOG_WARN, __func__, __VA_ARGS__))
#define LOGE(...) (__android_log_print(ANDROID_LOG_ERROR, __func__, __VA_ARGS__))

#endif
#endif
