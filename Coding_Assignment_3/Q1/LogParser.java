import java.io.*;
import java.nio.file.*;
import java.util.*;

public class LogParser {
    public static void main(String[] args) {
        if (args.length < 1) {
            System.err.println("Usage: java LogParser <filePath> [numLines] [types]");
            System.exit(1);
        }

        String filePath = args[0];
        int numLines = 10;
        String[] types = {"error"};

        if (args.length > 1) {
            try {
                numLines = Integer.parseInt(args[1]);
                if (numLines < 0) {
                    throw new NumberFormatException("Negative number");
                }
            } catch (NumberFormatException e) {
                System.err.println("Invalid number of lines: " + args[1]);
                System.exit(1);
            }
        }

        if (args.length > 2) {
            types = args[2].split(",");
            for (int i = 0; i < types.length; i++) {
                types[i] = types[i].trim().toLowerCase();
            }
        }

        // Validate file
        File file = new File(filePath);
        if (!file.exists()) {
            throw new RuntimeException("Invalid file path: " + filePath);
        }

        // Validate types
        Set<String> validTypes = new HashSet<>(Arrays.asList("error", "warning", "info", "debug"));
        for (String type : types) {
            if (!validTypes.contains(type)) {
                throw new RuntimeException("Invalid log type: " + type);
            }
        }

        // Read all lines
        List<String> lines = null;
        try {
            lines = Files.readAllLines(Paths.get(filePath));
        } catch (IOException e) {
            throw new RuntimeException("Error reading file: " + e.getMessage());
        }

        // Collect matching lines from the end
        List<String> matching = new ArrayList<>();
        for (int i = lines.size() - 1; i >= 0; i--) {
            String line = lines.get(i);
            if (line.trim().isEmpty()) continue;
            String logType = extractType(line);
            if (!logType.isEmpty() && Arrays.asList(types).contains(logType)) {
                matching.add(line);
                if (matching.size() == numLines) break;
            }
        }

        // Print the matching lines, most recent first
        for (String line : matching) {
            System.out.println(line);
        }
    }

    private static String extractType(String line) {
        int start = line.indexOf('[');
        int end = line.indexOf(']');
        if (start != -1 && end != -1 && end > start) {
            return line.substring(start + 1, end).toLowerCase();
        }
        return "";
    }
}