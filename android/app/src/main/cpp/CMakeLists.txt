cmake_minimum_required(VERSION 3.10.2)

project("invigilatus")

set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -std=gnu++17")
set(CMAKE_CXX_STANDARD 17)

add_library( tflite SHARED IMPORTED )
set_target_properties( tflite PROPERTIES IMPORTED_LOCATION
        ${CMAKE_CURRENT_LIST_DIR}/tf-lite/libs/${ANDROID_ABI}/libtensorflowlite_jni.so )

file(GLOB MLMODEL_SOURCES ${CMAKE_SOURCE_DIR}/src/ml/*.cpp)

add_library( mlmodel SHARED ${MLMODEL_SOURCES} )
target_include_directories(mlmodel PRIVATE
        ${CMAKE_CURRENT_LIST_DIR}/include
        ${CMAKE_CURRENT_LIST_DIR}/tf-lite/include
        ${CMAKE_CURRENT_LIST_DIR}/tf-lite/include/flatbuffers)

file(GLOB CAMERA_SOURCES ${CMAKE_SOURCE_DIR}/src/camera/*.cpp)

add_library( camera-view SHARED ${CAMERA_SOURCES} )
target_include_directories( camera-view PRIVATE
        ${CMAKE_CURRENT_LIST_DIR}/include)

find_library(log-lib log)
find_library(android-lib android)
find_library(camera-lib camera2ndk)
find_library(media-lib mediandk)
find_library(gl-lib GLESv3)

target_link_libraries( mlmodel
        ${log-lib}
        ${android-lib}
        tflite)

target_link_libraries( camera-view
        ${log-lib}
        ${android-lib}
        ${camera-lib}
        ${media-lib}
        ${gl-lib}
        mlmodel)
