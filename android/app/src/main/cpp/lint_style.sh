astyle --options=.astylerc -n src/ml/*
astyle --options=.astylerc -n src/camera/*
astyle --options=.astylerc -n src/reporter/JavaReporter.cpp \
  src/reporter/JavaReporter.h \
  src/reporter/NetworkReporter.cpp \
  src/reporter/NetworkReporter.h \
  src/reporter/ReporterMgr.cpp \
  src/reporter/ReporterMgr.h \
  src/reporter/reporter_jni.cpp \
  src/reporter/utils.cpp
astyle --options=.astylerc -n include/*
