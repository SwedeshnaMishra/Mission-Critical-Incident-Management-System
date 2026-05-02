def can_transition(current, new):
    allowed = {
        "OPEN": ["INVESTIGATING"],
        "INVESTIGATING": ["RESOLVED"],
        "RESOLVED": ["CLOSED"],
        "CLOSED": []
    }

    return new in allowed.get(current, [])