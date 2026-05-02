import time

request_counts = {}

def is_allowed(ip: str, limit=1000, window=1):
    current_time = time.time()

    if ip not in request_counts:
        request_counts[ip] = []

    # Remove old timestamps
    request_counts[ip] = [
        t for t in request_counts[ip] if current_time - t < window
    ]

    if len(request_counts[ip]) >= limit:
        return False

    request_counts[ip].append(current_time)
    return True