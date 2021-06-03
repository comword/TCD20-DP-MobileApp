#ifndef NATIVE_LIBS_POSTURECLASSIFY_H
#define NATIVE_LIBS_POSTURECLASSIFY_H

#include <memory>

class PostureClassify {
public:
    PostureClassify(const void *model_data, size_t model_size, bool use_gpu);

    virtual ~PostureClassify();

    bool IsInterpreterCreated();

    std::unique_ptr<int[]> DoInfer(int* img_rgb);

private:

};

#endif