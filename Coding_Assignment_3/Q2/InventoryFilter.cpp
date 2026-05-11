#include <iostream>
#include <fstream>
#include <vector>
#include <string>
#include <algorithm>
#include <stdexcept>
#include "json.hpp"

using json = nlohmann::json;

class Host {
public:
    std::string ip;
    std::string os;
    std::string memory;
    std::string cpu;
    std::string disk;

    Host(const json& j) {
        ip = j.at("ip");
        os = j.at("os");
        memory = j.at("memory");
        cpu = j.at("cpu");
        disk = j.at("disk");
    }

    double getMemoryGB() const {
        size_t pos = memory.find("GB");
        if (pos != std::string::npos) {
            return std::stod(memory.substr(0, pos));
        }
        return 0.0;
    }

    double getCPU() const {
        size_t pos = cpu.find("Ghz");
        if (pos != std::string::npos) {
            return std::stod(cpu.substr(0, pos));
        }
        return 0.0;
    }

    void print() const {
        std::cout << "IP: " << ip << ", OS: " << os << ", Memory: " << memory << ", CPU: " << cpu << ", Disk: " << disk << std::endl;
    }
};

class InventoryFilter {
private:
    std::vector<Host> hosts;

public:
    InventoryFilter(const std::string& filename) {
        std::ifstream file(filename);
        if (!file.is_open()) {
            throw std::runtime_error("Unable to open file: " + filename);
        }
        json j;
        file >> j;
        for (const auto& host_json : j.at("hosts")) {
            hosts.emplace_back(host_json);
        }
    }

    void filter(const std::string& criteria) {
        if (criteria.empty()) {
            throw std::invalid_argument("Filter criteria is missing");
        }

        std::string lower_criteria = criteria;
        std::transform(lower_criteria.begin(), lower_criteria.end(), lower_criteria.begin(), ::tolower);

        if (lower_criteria == "memory") {
            auto max_it = std::max_element(hosts.begin(), hosts.end(), [](const Host& a, const Host& b) {
                return a.getMemoryGB() < b.getMemoryGB();
            });
            if (max_it != hosts.end()) {
                max_it->print();
            }
        } else if (lower_criteria == "cpu") {
            auto max_it = std::max_element(hosts.begin(), hosts.end(), [](const Host& a, const Host& b) {
                return a.getCPU() < b.getCPU();
            });
            if (max_it != hosts.end()) {
                max_it->print();
            }
        } else if (lower_criteria == "linux" || lower_criteria == "windows") {
            for (const auto& host : hosts) {
                std::string lower_os = host.os;
                std::transform(lower_os.begin(), lower_os.end(), lower_os.begin(), ::tolower);
                if (lower_os == lower_criteria) {
                    host.print();
                }
            }
        } else {
            throw std::invalid_argument("Invalid filter criteria: " + criteria);
        }
    }
};

int main(int argc, char* argv[]) {
    if (argc < 3) {
        std::cerr << "Usage: " << argv[0] << " <json_file> <criteria>" << std::endl;
        return 1;
    }

    std::string filename = argv[1];
    std::string criteria = argv[2];

    try {
        InventoryFilter filter(filename);
        filter.filter(criteria);
    } catch (const std::exception& e) {
        std::cerr << "Error: " << e.what() << std::endl;
        return 1;
    }

    return 0;
}