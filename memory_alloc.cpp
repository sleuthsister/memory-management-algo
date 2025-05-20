#include<bits/stdc++.h>
using namespace std;
// Implementing memory allocation algorithms
int main() {
    int start = 1;
    cout << "Memory allocation algorithms\n";
    cout << "Enter number of processes: ";
    int n;
    cin >> n;
    cout << "\n";

    vector<int> processes(n);
    for (int i = 0; i < n; i++) {
        cout << "Enter process " << i + 1 << " size: ";
        cin >> processes[i];
    }

    cout << "Enter number of blocks: ";
    int n_block;
    cin >> n_block;
    cout << "\n";

    vector<int> blocks(n_block);
    for (int i = 0; i < n_block; i++) {
        cout << "Enter block " << i + 1 << " size: ";
        cin >> blocks[i];
    }

    cout << "Choose from the following algorithms to perform memory allocation..\n";

    while (start) {
        cout << "1. First fit algo\n";
        cout << "2. Next fit algo\n";
        cout << "3. Best fit algo\n";
        cout << "4. Worst fit algo\n";  
        cout << "5. Exit\n";

        int choice;
        cout << "Enter choice to perform memory allocation: ";
        cin >> choice;

        map<int, int> allocated;
        set<int> taken_blocks;
        int process_done = 0;
        int sum_process = accumulate(processes.begin(), processes.end(), 0);
        int internal_fragmentation = 0;
        int external_fragmentation = 0;

        if (choice == 1) {  // First Fit Algorithm
            for (int i : processes) {
                bool allocated_flag = false;
                for (int j : blocks) {
                    if (i <= j && taken_blocks.find(j) == taken_blocks.end()) {
                        allocated[j] = i;
                        taken_blocks.insert(j);
                        process_done += i;
                        internal_fragmentation += j - i;
                        allocated_flag = true;
                        break; 
                    }
                }
                if (!allocated_flag) {
                    cout << "Process of size " << i << " could not be allocated.\n";
                    external_fragmentation+=i;
                }
            }

            for (auto x : allocated) {
                cout << "Process " << x.second << " is allocated to block " << x.first << "\n";
            }

            cout << "The internal fragmentation is: " << internal_fragmentation << "\n";
            cout << "The external fragmentation is: " << external_fragmentation << "\n";
        }
        else if(choice == 3){ // best fit algo
            vector<int>sorted_block=blocks;
            sort(sorted_block.begin(),sorted_block.end());
            vector<int>sorted_pro=processes;
            sort(sorted_pro.begin(),sorted_pro.end());
            for(int i:sorted_pro)
            {
                bool allocated_flag = false;
                int best_index = -1;
                int min_diff = INT_MAX;

                // Find the best block for the current process
                for(int j = 0; j < n_block; j++) {
                    if (blocks[j] >= i && taken_blocks.find(j) == taken_blocks.end()) {
                        int diff = blocks[j] - i;
                        if (diff < min_diff) {
                            min_diff = diff;
                            best_index = j;
                        }
                    }
                }

                if (best_index != -1) {
                    allocated[best_index] = i;
                    taken_blocks.insert(best_index);
                    internal_fragmentation += blocks[best_index] - i;
                    allocated_flag = true;
                }

                if (!allocated_flag) {
                    cout << "Process of size " << i << " could not be allocated.\n";
                    external_fragmentation+=i;
                }
                // Display Allocation
                for (auto x : allocated) {
                    cout << "Process " << x.second << " is allocated to block " << x.first + 1 << "\n";
                }
                cout << "The internal fragmentation is: " << internal_fragmentation << "\n";
                cout << "The external fragmentation is: " << external_fragmentation << "\n";
            }
        }
        else if(choice==4){//worst fit algo
            for (int i : processes) {
                bool allocated_flag = false;
                int worst_index = -1;
                int max_diff = -1;
        
                // Find the worst block for the current process (largest block that fits)
                for (int j = 0; j < n_block; j++) {
                    if (blocks[j] >= i && taken_blocks.find(j) == taken_blocks.end()) {
                        int diff = blocks[j] - i;
                        if (diff > max_diff) {
                            max_diff = diff;
                            worst_index = j;
                        }
                    }
                }
        
                if (worst_index != -1) {
                    allocated[worst_index] = i;
                    taken_blocks.insert(worst_index);
                    internal_fragmentation += blocks[worst_index] - i;
                    allocated_flag = true;
                }
        
                if (!allocated_flag) {
                    cout << "Process of size " << i << " could not be allocated.\n";
                    external_fragmentation+=i;
                }
            }
            for (auto x : allocated) {
                cout << "Process " << x.second << " is allocated to block " << x.first + 1 << "\n";
            }
            cout << "The internal fragmentation is: " << internal_fragmentation << "\n";
            cout << "The external fragmentation is: " << external_fragmentation << "\n";
        }
        else if(choice==2)
        {
            //next fit algo
            for (int i : processes) {
                int last_index = 0;
                bool allocated_flag = false;
                int n_attempts = 0; // Prevent infinite loops
        
                // Start searching from the last allocated block (circular)
                while (n_attempts < n_block) {
                    if (blocks[last_index] >= i && taken_blocks.find(last_index) == taken_blocks.end()) {
                        allocated[last_index] = i;
                        taken_blocks.insert(last_index);
                        internal_fragmentation += blocks[last_index] - i;
                        allocated_flag = true;
                        break;
                    }
                    last_index = (last_index + 1) % n_block; // Circular increment
                    n_attempts++;
                }
        
                if (!allocated_flag) {
                    cout << "Process of size " << i << " could not be allocated.\n";
                    external_fragmentation+=i;
                }
            }
            for (auto x : allocated) {
                cout << "Process " << x.second << " is allocated to block " << x.first + 1 << "\n";
            }
            cout << "The internal fragmentation is: " << internal_fragmentation << "\n";
            cout << "The external fragmentation is: " << external_fragmentation << "\n";
        }
        else{
            start=0;
        }
    }
    return 0;
}
