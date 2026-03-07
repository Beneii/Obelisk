def compress_context(file_summaries: list[str], memory_notes: list[str], max_chars: int = 4000) -> str:
    payload = "\n".join([*file_summaries, *memory_notes])
    return payload[:max_chars]
