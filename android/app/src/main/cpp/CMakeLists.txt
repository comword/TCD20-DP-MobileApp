cmake_minimum_required(VERSION 3.10.2)

project("invigilatus")

# Specify where to find the header files for TF Lite C++
set( INCLUDE_DIRS
        ${CMAKE_CURRENT_LIST_DIR}/tf-lite/include
        ${CMAKE_CURRENT_LIST_DIR}/tf-lite/include/flatbuffers)
include_directories(${INCLUDE_DIRS})

add_library( tflite SHARED IMPORTED )
set_target_properties( tflite PROPERTIES IMPORTED_LOCATION
        ${CMAKE_CURRENT_LIST_DIR}/tf-lite/libs/${ANDROID_ABI}/libtensorflowlite.so )

add_library( tflite-gpu SHARED IMPORTED )
set_target_properties( tflite-gpu PROPERTIES IMPORTED_LOCATION
        ${CMAKE_CURRENT_LIST_DIR}/tf-lite/libs/${ANDROID_ABI}/libtensorflowlite_gpu_delegate.so )

add_library( mlmodel SHARED src/main.cpp )

find_library(log-lib log) # Library required by NDK.
find_library(android-lib android) # for AssetManager functionality

# Link the main target with two required libs: `log` and `libtensorflowlite.so`
target_link_libraries( mlmodel ${log-lib} ${android-lib} tflite tflite-gpu)