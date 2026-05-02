import redis

r = redis.Redis(host="redis", port=6379, decode_responses=True)

WINDOW = 10  # seconds

def should_create_work_item(component_id):
    key = f"debounce:{component_id}"

    is_new = r.set(key, "1", ex=WINDOW, nx=True)

    if is_new:
        return True   
    else:
        return False  