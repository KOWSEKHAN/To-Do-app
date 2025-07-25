import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  Switch,
} from "react-native";
import { useTheme } from "../components/ThemeContext";

interface Task {
  id: string;
  title: string;
  completed: boolean;
  time: Date;
}

export default function HomeScreen() {
  const { isDark, toggleTheme } = useTheme();
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [hour, setHour] = useState("");
  const [minute, setMinute] = useState("");
  const [ampm, setAmPm] = useState<"AM" | "PM">("AM");
  const [sortAsc, setSortAsc] = useState(true);

  const addTask = () => {
    if (!task.trim()) return;

    let h = parseInt(hour);
    let m = parseInt(minute);

    if (isNaN(h)) h = 0;
    if (isNaN(m)) m = 0;

    // Clamp hour to 1–12
    h = Math.min(Math.max(h, 1), 12);
    // Clamp minute to 0–59
    m = Math.min(Math.max(m, 0), 59);

    // Convert to 24-hour format
    if (ampm === "PM" && h < 12) {
      h += 12;
    } else if (ampm === "AM" && h === 12) {
      h = 0;
    }

    const time = new Date();
    time.setHours(h);
    time.setMinutes(m);
    time.setSeconds(0);
    time.setMilliseconds(0);

    const newTask: Task = {
      id: Date.now().toString(),
      title: task,
      completed: false,
      time,
    };

    setTasks([...tasks, newTask]);
    setTask("");
    setHour("");
    setMinute("");
    setAmPm("AM");
  };

  const toggleTask = (id: string) => {
    setTasks(
      tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const markAllComplete = () => {
    setTasks(tasks.map((t) => ({ ...t, completed: true })));
  };

  const sortTasks = () => {
    const sorted = [...tasks].sort((a, b) =>
      sortAsc
        ? a.time.getTime() - b.time.getTime()
        : b.time.getTime() - a.time.getTime()
    );
    setTasks(sorted);
    setSortAsc(!sortAsc);
  };

  const updateTaskTitle = (id: string, title: string) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, title } : t)));
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <View
      style={[
        { flex: 1 },
        styles.container,
        isDark && { backgroundColor: "#111" },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, isDark && { color: "#fff" }]}>
          To-Do App
        </Text>
        <View style={styles.profileSection}>
          <Text style={[{ marginRight: 8 }, isDark && { color: "#fff" }]}>
            Dark Mode
          </Text>
          <Switch value={isDark} onValueChange={toggleTheme} />
        </View>
      </View>

      {/* Task input */}
      <TextInput
        value={task}
        onChangeText={setTask}
        placeholder="Enter a task"
        style={[
          styles.input,
          isDark && { backgroundColor: "#333", color: "#fff" },
        ]}
        placeholderTextColor={isDark ? "#aaa" : "#888"}
      />

      {/* Time input */}
      <View style={styles.timeRow}>
        <Text style={[styles.timeLabel, isDark && { color: "#fff" }]}>
          Time:
        </Text>
        <TextInput
          style={[
            styles.timeInput,
            isDark && { backgroundColor: "#333", color: "#fff" },
          ]}
          placeholder="HH"
          value={hour}
          onChangeText={setHour}
          keyboardType="numeric"
          maxLength={2}
        />
        <Text
          style={[
            { fontSize: 16, marginHorizontal: 4 },
            isDark && { color: "#fff" },
          ]}
        >
          :
        </Text>
        <TextInput
          style={[
            styles.timeInput,
            isDark && { backgroundColor: "#333", color: "#fff" },
          ]}
          placeholder="MM"
          value={minute}
          onChangeText={setMinute}
          keyboardType="numeric"
          maxLength={2}
        />
      </View>

      {/* AM/PM toggle */}
      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}
      >
        <Text style={[{ marginRight: 10 }, isDark && { color: "#fff" }]}>
          AM/PM:
        </Text>
        <TouchableOpacity
          style={[styles.ampmButton, ampm === "AM" && styles.ampmSelected]}
          onPress={() => setAmPm("AM")}
        >
          <Text style={{ color: "#fff" }}>AM</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.ampmButton, ampm === "PM" && styles.ampmSelected]}
          onPress={() => setAmPm("PM")}
        >
          <Text style={{ color: "#fff" }}>PM</Text>
        </TouchableOpacity>
      </View>

      {/* Buttons */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 10,
        }}
      >
        <Button title="Add Task" onPress={addTask} />
        <Button title="Sort by Time" onPress={sortTasks} />
      </View>

      {/* Task list */}
      <FlatList
        style={{ flex: 1 }}
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => toggleTask(item.id)}>
            <View style={styles.taskContainer}>
              <View style={{ flex: 1 }}>
                <TextInput
                  style={[
                    item.completed ? styles.taskDone : styles.task,
                    isDark && { color: "#fff" },
                  ]}
                  value={item.title}
                  onChangeText={(text) => updateTaskTitle(item.id, text)}
                />
                <Text
                  style={[
                    { fontSize: 12, color: "#999" },
                    isDark && { color: "#ccc" },
                  ]}
                >
                  {formatTime(item.time)}
                </Text>
              </View>
              <Button title="Delete" onPress={() => deleteTask(item.id)} />
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Mark all complete button */}
      {tasks.length > 0 && (
        <View style={{ paddingVertical: 10 }}>
          <Button title="Mark All Complete" onPress={markAllComplete} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  timeLabel: {
    marginRight: 10,
    fontSize: 16,
  },
  timeInput: {
    width: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 8,
    borderRadius: 5,
    textAlign: "center",
  },
  ampmButton: {
    padding: 8,
    borderRadius: 5,
    backgroundColor: "#888",
    marginRight: 10,
  },
  ampmSelected: {
    backgroundColor: "#2196F3",
  },
  taskContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  task: {
    fontSize: 16,
    flex: 1,
  },
  taskDone: {
    fontSize: 16,
    textDecorationLine: "line-through",
    color: "gray",
    flex: 1,
  },
});
