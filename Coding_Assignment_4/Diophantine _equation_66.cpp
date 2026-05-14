#include <bits/stdc++.h>
using namespace std;


void printInt128(__int128 n) {
    if (n == 0) {
        cout << 0;
        return;
    }

    string s;
    while (n > 0) {
        s += (n % 10) + '0';
        n /= 10;
    }

    reverse(s.begin(), s.end());
    cout << s;
}


__int128 minimalX(int D) {
    int a0 = sqrt(D);

  
    if (a0 * a0 == D)
        return 0;

    int m = 0, d = 1, a = a0;

    __int128 num1 = 1, num = a;
    __int128 den1 = 0, den = 1;

    while (num * num - (__int128)D * den * den != 1) {
        m = d * a - m;
        d = (D - m * m) / d;
        a = (a0 + m) / d;

        __int128 num2 = a * num + num1;
        __int128 den2 = a * den + den1;

        num1 = num;
        num = num2;

        den1 = den;
        den = den2;
    }

    return num;
}

int main() {
    int limit;

    cout << "Enter upper limit for D: ";
    cin >> limit;

    __int128 maxX = 0;
    int answer = 0;

    for (int D = 2; D <= limit; D++) {
        int root = sqrt(D);

        
        if (root * root == D)
            continue;

        __int128 x = minimalX(D);

        if (x > maxX) {
            maxX = x;
            answer = D;
        }
    }

    cout << "D with largest minimal x: " << answer << endl;

    return 0;
}