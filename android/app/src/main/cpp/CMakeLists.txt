cmake_minimum_required(VERSION 3.10.2)

project("invigilatus")

set(CMAKE_FIND_ROOT_PATH_MODE_LIBRARY BOTH)
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -std=gnu++17")
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_LIBRARY_PATH ${CMAKE_LIBRARY_PATH}
        ${CMAKE_SOURCE_DIR}/../../../libs/tf-lite/libs/${ANDROID_ABI}
        ${CMAKE_CURRENT_LIST_DIR}/../../../libs/opencv/libs/${ANDROID_ABI}
        ${CMAKE_CURRENT_LIST_DIR}/../../../libs/grpc/libs/${ANDROID_ABI})
set(CMAKE_CXX_VISIBILITY_PRESET hidden)

add_library( tflite SHARED IMPORTED )
set_target_properties( tflite PROPERTIES IMPORTED_LOCATION
        ${CMAKE_SOURCE_DIR}/../../../libs/tf-lite/libs/${ANDROID_ABI}/libtensorflowlite_jni.so )

file(GLOB MLMODEL_SOURCES ${CMAKE_SOURCE_DIR}/src/ml/*.cpp)

add_library( mlmodel SHARED ${MLMODEL_SOURCES} )
target_include_directories(mlmodel PRIVATE
        ${CMAKE_CURRENT_LIST_DIR}/include
        ${CMAKE_CURRENT_LIST_DIR}/../../../libs/tf-lite/include
        ${CMAKE_CURRENT_LIST_DIR}/../../../libs/tf-lite/include/flatbuffers
        ${CMAKE_CURRENT_LIST_DIR}/../../../libs/opencv/include)

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

find_library(protobuf-lite protobuf-lite)
find_library(absl_strings_internal absl_strings_internal)
find_library(absl absl)
find_library(gpr gpr)
find_library(crypto crypto)
find_library(ssl ssl)
find_library(grpc grpc)
find_library(address_sorting address_sorting)
find_library(re2 re2)
find_library(upb upb)
find_library(cares cares)
find_library(grpc-libz z PATHS ${CMAKE_CURRENT_LIST_DIR}/../../../libs/grpc/libs/${ANDROID_ABI} NO_DEFAULT_PATH)
find_library(grpc++ grpc++)

file(GLOB CAMERA_SOURCES ${CMAKE_SOURCE_DIR}/src/camera/*.cpp)

add_library( camera-view SHARED ${CAMERA_SOURCES} )
target_include_directories( camera-view PRIVATE
        ${CMAKE_CURRENT_LIST_DIR}/include
        ${CMAKE_CURRENT_LIST_DIR}/../../../libs/opencv/include)

file(GLOB RESULT_REPORT_SOURCES ${CMAKE_SOURCE_DIR}/src/reporter/*.cpp)
file(GLOB GRPCPB_SOURCES ${CMAKE_SOURCE_DIR}/src/reporter/*.cc)

add_library( result-report SHARED ${RESULT_REPORT_SOURCES} ${GRPCPB_SOURCES})
target_include_directories( result-report PRIVATE
        ${CMAKE_CURRENT_LIST_DIR}/include
        ${CMAKE_CURRENT_LIST_DIR}/../../../libs/opencv/include
        ${CMAKE_CURRENT_LIST_DIR}/../../../libs/grpc/include)

find_library(log-lib log)
find_library(android-lib android)
find_library(camera-lib camera2ndk)
find_library(media-lib mediandk)
find_library(gl-lib GLESv3)
find_library(egl-lib EGL)

target_link_libraries(result-report
        ${log-lib} ${android-lib} ${grpc++} ${grpc} ${cares} ${upb} ${re2} ${address_sorting}
        ${grpc-libz} ${ssl} ${crypto} ${gpr} ${absl} ${absl_strings_internal} ${protobuf-lite}
        cv-imgcodecs cv-imgproc cv-core cv-tbb)

target_link_libraries(mlmodel
        ${log-lib} ${android-lib} ${gl-lib} ${egl-lib}
        tflite cv-imgproc cv-core cv-tbb result-report)

target_link_libraries(camera-view
        ${log-lib} ${android-lib} ${camera-lib} ${media-lib} ${gl-lib} ${egl-lib}
        cv-tbb cv-core cv-imgproc cv-features2d cv-flann cv-calib3d cv-objdetect
        cv-imgcodecs cv-videoio cv-photo cv-face mlmodel)
