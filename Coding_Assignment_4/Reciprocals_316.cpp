#include <iostream>
#include <vector>
#include <string>
using namespace std;


vector<int> buildLPS(const string& pattern) {
    int n = pattern.size();
    vector<int> lps(n, 0);

    int len = 0;
    int i = 1;

    while (i < n) {
        if (pattern[i] == pattern[len]) {
            len++;
            lps[i] = len;
            i++;
        } else {
            if (len != 0) {
                len = lps[len - 1];
            } else {
                lps[i] = 0;
                i++;
            }
        }
    }

    return lps;
}


double expectedSteps(string pattern) {
    int n = pattern.size();

    vector<int> lps = buildLPS(pattern);

    vector<double> dp(n + 1, 0);


    for (int state = n - 1; state >= 0; state--) {
        double sum = 0;

        for (char digit = '0'; digit <= '9'; digit++) {
            int j = state;

            while (j > 0 && pattern[j] != digit) {
                j = lps[j - 1];
            }

            if (pattern[j] == digit) {
                j++;
            }

            sum += dp[j];
        }

        dp[state] = 1 + sum / 10.0;
    }

    return dp[0];
}

int main() {
    string pattern;

    cout << "Enter digit pattern: ";
    cin >> pattern;

    cout << "Pattern: " << pattern << endl;

    double result = expectedSteps(pattern);

    cout << "Expected steps: " << result << endl;

    return 0;
}