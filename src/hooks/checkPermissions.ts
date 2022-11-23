import { useRoute } from "vue-router";

export default (permission: "add" | "update" | "delete" | "select"): boolean => !!(useRoute().meta[permission])
