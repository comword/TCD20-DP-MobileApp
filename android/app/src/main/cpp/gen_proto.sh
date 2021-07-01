# protoc version should be 3.15.8
#~/Downloads/protoc-3.15.8-osx-x86_64/bin/protoc
#~/Downloads/protoc-3.15.8-osx-x86_64/bin/protoc --cpp_out=lite:src/reporter ~/Downloads/protoc-3.15.8-osx-x86_64/include/google/protobuf/timestamp.proto

protoc -I ../proto --cpp_out=lite:src/reporter --grpc_out=src/reporter --plugin=protoc-gen-grpc=`which grpc_cpp_plugin` student.proto
