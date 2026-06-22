export function formatDate(value) {
  if (!value) {
    return "No date";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric"
  }).format(new Date(value));
}

export function formatDateTime(value) {
  if (!value) {
    return "";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(value));
}

export function dueTone(value) {
  if (!value) {
    return "neutral";
  }

  const due = new Date(value).getTime();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (due < today.getTime()) {
    return "danger";
  }

  const soon = new Date(today);
  soon.setDate(soon.getDate() + 2);

  return due <= soon.getTime() ? "warning" : "neutral";
}
