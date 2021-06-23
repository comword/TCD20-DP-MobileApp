#ifndef INVIGILATOR_JAVAREPORTER_H
#define INVIGILATOR_JAVAREPORTER_H

#include "IResultReporter.h"

struct JavaVM;
struct JNIEnv;

class JavaReporter: public IResultReporter {
public:
    void connectJvm(JavaVM* jvm);
    JNIEnv* GetJniEnv();
private:
    JavaVM* jvm;
};


#endif //INVIGILATOR_JAVAREPORTER_H
