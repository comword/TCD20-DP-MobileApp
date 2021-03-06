// Generated by the protocol buffer compiler.  DO NOT EDIT!
// source: google/protobuf/timestamp.proto

#include "timestamp.pb.h"

#include <algorithm>

#include <google/protobuf/io/coded_stream.h>
#include <google/protobuf/extension_set.h>
#include <google/protobuf/wire_format_lite.h>
#include <google/protobuf/io/zero_copy_stream_impl_lite.h>
// @@protoc_insertion_point(includes)
#include <google/protobuf/port_def.inc>

PROTOBUF_PRAGMA_INIT_SEG
PROTOBUF_NAMESPACE_OPEN
constexpr Timestamp::Timestamp(
  ::PROTOBUF_NAMESPACE_ID::internal::ConstantInitialized)
  : seconds_(PROTOBUF_LONGLONG(0))
  , nanos_(0){}
struct TimestampDefaultTypeInternal {
  constexpr TimestampDefaultTypeInternal()
    : _instance(::PROTOBUF_NAMESPACE_ID::internal::ConstantInitialized{}) {}
  ~TimestampDefaultTypeInternal() {}
  union {
    Timestamp _instance;
  };
};
PROTOBUF_ATTRIBUTE_NO_DESTROY PROTOBUF_CONSTINIT TimestampDefaultTypeInternal _Timestamp_default_instance_;
PROTOBUF_NAMESPACE_CLOSE
PROTOBUF_NAMESPACE_OPEN

// ===================================================================

class Timestamp::_Internal {
 public:
};

Timestamp::Timestamp(::PROTOBUF_NAMESPACE_ID::Arena* arena)
  : ::PROTOBUF_NAMESPACE_ID::MessageLite(arena) {
  SharedCtor();
  RegisterArenaDtor(arena);
  // @@protoc_insertion_point(arena_constructor:google.protobuf.Timestamp)
}
Timestamp::Timestamp(const Timestamp& from)
  : ::PROTOBUF_NAMESPACE_ID::MessageLite() {
  _internal_metadata_.MergeFrom<std::string>(from._internal_metadata_);
  ::memcpy(&seconds_, &from.seconds_,
    static_cast<size_t>(reinterpret_cast<char*>(&nanos_) -
    reinterpret_cast<char*>(&seconds_)) + sizeof(nanos_));
  // @@protoc_insertion_point(copy_constructor:google.protobuf.Timestamp)
}

void Timestamp::SharedCtor() {
::memset(reinterpret_cast<char*>(this) + static_cast<size_t>(
    reinterpret_cast<char*>(&seconds_) - reinterpret_cast<char*>(this)),
    0, static_cast<size_t>(reinterpret_cast<char*>(&nanos_) -
    reinterpret_cast<char*>(&seconds_)) + sizeof(nanos_));
}

Timestamp::~Timestamp() {
  // @@protoc_insertion_point(destructor:google.protobuf.Timestamp)
  SharedDtor();
  _internal_metadata_.Delete<std::string>();
}

void Timestamp::SharedDtor() {
  GOOGLE_DCHECK(GetArena() == nullptr);
}

void Timestamp::ArenaDtor(void* object) {
  Timestamp* _this = reinterpret_cast< Timestamp* >(object);
  (void)_this;
}
void Timestamp::RegisterArenaDtor(::PROTOBUF_NAMESPACE_ID::Arena*) {
}
void Timestamp::SetCachedSize(int size) const {
  _cached_size_.Set(size);
}

void Timestamp::Clear() {
// @@protoc_insertion_point(message_clear_start:google.protobuf.Timestamp)
  ::PROTOBUF_NAMESPACE_ID::uint32 cached_has_bits = 0;
  // Prevent compiler warnings about cached_has_bits being unused
  (void) cached_has_bits;

  ::memset(&seconds_, 0, static_cast<size_t>(
      reinterpret_cast<char*>(&nanos_) -
      reinterpret_cast<char*>(&seconds_)) + sizeof(nanos_));
  _internal_metadata_.Clear<std::string>();
}

const char* Timestamp::_InternalParse(const char* ptr, ::PROTOBUF_NAMESPACE_ID::internal::ParseContext* ctx) {
#define CHK_(x) if (PROTOBUF_PREDICT_FALSE(!(x))) goto failure
  while (!ctx->Done(&ptr)) {
    ::PROTOBUF_NAMESPACE_ID::uint32 tag;
    ptr = ::PROTOBUF_NAMESPACE_ID::internal::ReadTag(ptr, &tag);
    CHK_(ptr);
    switch (tag >> 3) {
      // int64 seconds = 1;
      case 1:
        if (PROTOBUF_PREDICT_TRUE(static_cast<::PROTOBUF_NAMESPACE_ID::uint8>(tag) == 8)) {
          seconds_ = ::PROTOBUF_NAMESPACE_ID::internal::ReadVarint64(&ptr);
          CHK_(ptr);
        } else goto handle_unusual;
        continue;
      // int32 nanos = 2;
      case 2:
        if (PROTOBUF_PREDICT_TRUE(static_cast<::PROTOBUF_NAMESPACE_ID::uint8>(tag) == 16)) {
          nanos_ = ::PROTOBUF_NAMESPACE_ID::internal::ReadVarint64(&ptr);
          CHK_(ptr);
        } else goto handle_unusual;
        continue;
      default: {
      handle_unusual:
        if ((tag & 7) == 4 || tag == 0) {
          ctx->SetLastTag(tag);
          goto success;
        }
        ptr = UnknownFieldParse(tag,
            _internal_metadata_.mutable_unknown_fields<std::string>(),
            ptr, ctx);
        CHK_(ptr != nullptr);
        continue;
      }
    }  // switch
  }  // while
success:
  return ptr;
failure:
  ptr = nullptr;
  goto success;
#undef CHK_
}

::PROTOBUF_NAMESPACE_ID::uint8* Timestamp::_InternalSerialize(
    ::PROTOBUF_NAMESPACE_ID::uint8* target, ::PROTOBUF_NAMESPACE_ID::io::EpsCopyOutputStream* stream) const {
  // @@protoc_insertion_point(serialize_to_array_start:google.protobuf.Timestamp)
  ::PROTOBUF_NAMESPACE_ID::uint32 cached_has_bits = 0;
  (void) cached_has_bits;

  // int64 seconds = 1;
  if (this->seconds() != 0) {
    target = stream->EnsureSpace(target);
    target = ::PROTOBUF_NAMESPACE_ID::internal::WireFormatLite::WriteInt64ToArray(1, this->_internal_seconds(), target);
  }

  // int32 nanos = 2;
  if (this->nanos() != 0) {
    target = stream->EnsureSpace(target);
    target = ::PROTOBUF_NAMESPACE_ID::internal::WireFormatLite::WriteInt32ToArray(2, this->_internal_nanos(), target);
  }

  if (PROTOBUF_PREDICT_FALSE(_internal_metadata_.have_unknown_fields())) {
    target = stream->WriteRaw(_internal_metadata_.unknown_fields<std::string>(::PROTOBUF_NAMESPACE_ID::internal::GetEmptyString).data(),
        static_cast<int>(_internal_metadata_.unknown_fields<std::string>(::PROTOBUF_NAMESPACE_ID::internal::GetEmptyString).size()), target);
  }
  // @@protoc_insertion_point(serialize_to_array_end:google.protobuf.Timestamp)
  return target;
}

size_t Timestamp::ByteSizeLong() const {
// @@protoc_insertion_point(message_byte_size_start:google.protobuf.Timestamp)
  size_t total_size = 0;

  ::PROTOBUF_NAMESPACE_ID::uint32 cached_has_bits = 0;
  // Prevent compiler warnings about cached_has_bits being unused
  (void) cached_has_bits;

  // int64 seconds = 1;
  if (this->seconds() != 0) {
    total_size += 1 +
      ::PROTOBUF_NAMESPACE_ID::internal::WireFormatLite::Int64Size(
        this->_internal_seconds());
  }

  // int32 nanos = 2;
  if (this->nanos() != 0) {
    total_size += 1 +
      ::PROTOBUF_NAMESPACE_ID::internal::WireFormatLite::Int32Size(
        this->_internal_nanos());
  }

  if (PROTOBUF_PREDICT_FALSE(_internal_metadata_.have_unknown_fields())) {
    total_size += _internal_metadata_.unknown_fields<std::string>(::PROTOBUF_NAMESPACE_ID::internal::GetEmptyString).size();
  }
  int cached_size = ::PROTOBUF_NAMESPACE_ID::internal::ToCachedSize(total_size);
  SetCachedSize(cached_size);
  return total_size;
}

void Timestamp::CheckTypeAndMergeFrom(
    const ::PROTOBUF_NAMESPACE_ID::MessageLite& from) {
  MergeFrom(*::PROTOBUF_NAMESPACE_ID::internal::DownCast<const Timestamp*>(
      &from));
}

void Timestamp::MergeFrom(const Timestamp& from) {
// @@protoc_insertion_point(class_specific_merge_from_start:google.protobuf.Timestamp)
  GOOGLE_DCHECK_NE(&from, this);
  _internal_metadata_.MergeFrom<std::string>(from._internal_metadata_);
  ::PROTOBUF_NAMESPACE_ID::uint32 cached_has_bits = 0;
  (void) cached_has_bits;

  if (from.seconds() != 0) {
    _internal_set_seconds(from._internal_seconds());
  }
  if (from.nanos() != 0) {
    _internal_set_nanos(from._internal_nanos());
  }
}

void Timestamp::CopyFrom(const Timestamp& from) {
// @@protoc_insertion_point(class_specific_copy_from_start:google.protobuf.Timestamp)
  if (&from == this) return;
  Clear();
  MergeFrom(from);
}

bool Timestamp::IsInitialized() const {
  return true;
}

void Timestamp::InternalSwap(Timestamp* other) {
  using std::swap;
  _internal_metadata_.Swap<std::string>(&other->_internal_metadata_);
  ::PROTOBUF_NAMESPACE_ID::internal::memswap<
      PROTOBUF_FIELD_OFFSET(Timestamp, nanos_)
      + sizeof(Timestamp::nanos_)
      - PROTOBUF_FIELD_OFFSET(Timestamp, seconds_)>(
          reinterpret_cast<char*>(&seconds_),
          reinterpret_cast<char*>(&other->seconds_));
}

std::string Timestamp::GetTypeName() const {
  return "google.protobuf.Timestamp";
}


// @@protoc_insertion_point(namespace_scope)
PROTOBUF_NAMESPACE_CLOSE
PROTOBUF_NAMESPACE_OPEN
template<> PROTOBUF_NOINLINE PROTOBUF_NAMESPACE_ID::Timestamp* Arena::CreateMaybeMessage< PROTOBUF_NAMESPACE_ID::Timestamp >(Arena* arena) {
  return Arena::CreateMessageInternal< PROTOBUF_NAMESPACE_ID::Timestamp >(arena);
}
PROTOBUF_NAMESPACE_CLOSE

// @@protoc_insertion_point(global_scope)
#include <google/protobuf/port_undef.inc>
