import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from "react-native"
import { Menu, Bell, Search, MoveVertical as MoreVertical, User } from "lucide-react-native"

interface Props {
  title: string
  subtitle?: string
  onToggleSidebar: () => void
  showMenuButton?: boolean
  activeFiltersCount?: number
}

export function TopBar({ title, subtitle, onToggleSidebar, showMenuButton = true, activeFiltersCount = 0 }: Props) {
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <View style={styles.container}>
        <View style={styles.leftSection}>
          {showMenuButton && (
            <TouchableOpacity
              style={styles.menuButton}
              onPress={onToggleSidebar}
              hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
            >
              <Menu size={24} color="#374151" />
              {activeFiltersCount > 0 && (
                <View style={styles.filterBadge}>
                  <Text style={styles.filterBadgeText}>{activeFiltersCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          )}

          <View style={styles.titleSection}>
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
            {subtitle && (
              <Text style={styles.subtitle} numberOfLines={1}>
                {subtitle}
              </Text>
            )}
          </View>
        </View>

        <View style={styles.rightSection}>
          <TouchableOpacity style={styles.iconButton} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Search size={20} color="#6b7280" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconButton} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Bell size={20} color="#6b7280" />
            <View style={styles.notificationDot} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.profileButton} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <User size={18} color="#6b7280" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconButton} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <MoreVertical size={20} color="#6b7280" />
          </TouchableOpacity>
        </View>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
    minHeight: 64,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 16,
  },
  menuButton: {
    position: "relative",
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginRight: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  titleSection: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 18,
    fontFamily: "Inter-SemiBold",
    color: "#111827",
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "Inter-Regular",
    color: "#6b7280",
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconButton: {
    position: "relative",
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  profileButton: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: "#f3f4f6",
    borderWidth: 1,
    borderColor: "#d1d5db",
  },
  filterBadge: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "#ef4444",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  filterBadgeText: {
    fontSize: 10,
    fontFamily: "Inter-Bold",
    color: "#ffffff",
  },
  notificationDot: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ef4444",
    borderWidth: 1,
    borderColor: "#ffffff",
  },
})
