cmake_minimum_required(VERSION 3.10.2)

project("invigilatus")

set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -std=gnu++17")
set(CMAKE_CXX_STANDARD 17)

add_library( tflite SHARED IMPORTED )
set_target_properties( tflite PROPERTIES IMPORTED_LOCATION
        ${CMAKE_SOURCE_DIR}/../../../libs/tf-lite/libs/${ANDROID_ABI}/libtensorflowlite_jni.so )

file(GLOB MLMODEL_SOURCES ${CMAKE_SOURCE_DIR}/src/ml/*.cpp)

add_library( mlmodel SHARED ${MLMODEL_SOURCES} )
target_include_directories(mlmodel PRIVATE
        ${CMAKE_CURRENT_LIST_DIR}/include
        ${CMAKE_CURRENT_LIST_DIR}/../../../libs/tf-lite/include
        ${CMAKE_CURRENT_LIST_DIR}/../../../libs/tf-lite/include/flatbuffers)

add_library( cv-core SHARED IMPORTED )
set_target_properties( cv-core PROPERTIES IMPORTED_LOCATION
        ${CMAKE_CURRENT_LIST_DIR}/../../../libs/opencv/libs/${ANDROID_ABI}/libopencv_core.so )
add_library( cv-imgproc SHARED IMPORTED )
set_target_properties( cv-imgproc PROPERTIES IMPORTED_LOCATION
        ${CMAKE_CURRENT_LIST_DIR}/../../../libs/opencv/libs/${ANDROID_ABI}/libopencv_imgproc.so )
add_library( cv-features2d SHARED IMPORTED )
set_target_properties( cv-features2d PROPERTIES IMPORTED_LOCATION
        ${CMAKE_CURRENT_LIST_DIR}/../../../libs/opencv/libs/${ANDROID_ABI}/libopencv_features2d.so )
add_library( cv-flann SHARED IMPORTED )
set_target_properties( cv-flann PROPERTIES IMPORTED_LOCATION
        ${CMAKE_CURRENT_LIST_DIR}/../../../libs/opencv/libs/${ANDROID_ABI}/libopencv_flann.so )
add_library( cv-calib3d SHARED IMPORTED )
set_target_properties( cv-calib3d PROPERTIES IMPORTED_LOCATION
        ${CMAKE_CURRENT_LIST_DIR}/../../../libs/opencv/libs/${ANDROID_ABI}/libopencv_calib3d.so )
add_library( cv-objdetect SHARED IMPORTED )
set_target_properties( cv-objdetect PROPERTIES IMPORTED_LOCATION
        ${CMAKE_CURRENT_LIST_DIR}/../../../libs/opencv/libs/${ANDROID_ABI}/libopencv_objdetect.so )
add_library( cv-imgcodecs SHARED IMPORTED )
set_target_properties( cv-imgcodecs PROPERTIES IMPORTED_LOCATION
        ${CMAKE_CURRENT_LIST_DIR}/../../../libs/opencv/libs/${ANDROID_ABI}/libopencv_imgcodecs.so )
add_library( cv-videoio SHARED IMPORTED )
set_target_properties( cv-videoio PROPERTIES IMPORTED_LOCATION
        ${CMAKE_CURRENT_LIST_DIR}/../../../libs/opencv/libs/${ANDROID_ABI}/libopencv_videoio.so )
add_library( cv-photo SHARED IMPORTED )
set_target_properties( cv-photo PROPERTIES IMPORTED_LOCATION
        ${CMAKE_CURRENT_LIST_DIR}/../../../libs/opencv/libs/${ANDROID_ABI}/libopencv_photo.so )
add_library( cv-face SHARED IMPORTED )
set_target_properties( cv-face PROPERTIES IMPORTED_LOCATION
        ${CMAKE_CURRENT_LIST_DIR}/../../../libs/opencv/libs/${ANDROID_ABI}/libopencv_face.so )
add_library( cv-tbb SHARED IMPORTED )
set_target_properties( cv-tbb PROPERTIES IMPORTED_LOCATION
        ${CMAKE_CURRENT_LIST_DIR}/../../../libs/opencv/libs/${ANDROID_ABI}/libtbb.so )

file(GLOB CAMERA_SOURCES ${CMAKE_SOURCE_DIR}/src/camera/*.cpp)

add_library( camera-view SHARED ${CAMERA_SOURCES} )
target_include_directories( camera-view PRIVATE
        ${CMAKE_CURRENT_LIST_DIR}/../../../libs/opencv/include
        ${CMAKE_CURRENT_LIST_DIR}/include)

find_library(log-lib log)
find_library(android-lib android)
find_library(camera-lib camera2ndk)
find_library(media-lib mediandk)
find_library(gl-lib GLESv3)
find_library(egl-lib EGL)

target_link_libraries(mlmodel
        ${log-lib} ${android-lib}
        tflite cv-tbb cv-core cv-imgproc)

target_link_libraries(camera-view
        ${log-lib} ${android-lib} ${camera-lib} ${media-lib} ${gl-lib} ${egl-lib}
        cv-tbb cv-core cv-imgproc cv-features2d cv-flann cv-calib3d cv-objdetect
        cv-imgcodecs cv-videoio cv-photo cv-face mlmodel)
