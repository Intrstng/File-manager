# File Manager
## Task
[_File Manager - Task RS School **Node.js** course_](https://github.com/AlreadyBored/nodejs-assignments/blob/main/assignments/file-manager/assignment.md)
### _Description_
Your task is to implement File Manager using **Node.js** APIs.
The file manager should be able to do the following:
- Work using CLI
- Perform basic file operations (copy, move, delete, rename, etc.)
- Utilize Streams API
- Get information about the host machine operating system
- Perform hash calculations
- Compress and decompress files
### _List of operations and their syntax:_
The program is started by npm-script start in following way:
```sh
npm run start -- --username=your_username
```
1. **Navigation & working directory (nwd)**
- Go upper from current directory (when you are in the root folder this operation shouldn't change working directory)
```sh
up
```
- Go to dedicated folder from current directory (```path_to_directory``` can be relative or absolute)
```sh
cd path_to_directory
```
- Print in console list of all files and folders in current directory. List should contain:
    * _list should contain files and folder names (for files - with extension)_
    * _folders and files are sorted in alphabetical order ascending, but list of folders goes first_
    * _type of directory content should be marked explicitly (e.g. as a corresponding column value)_
```sh
ls
```
2. **Basic operations with files**
- Read file and print it's content in console (should be done using _Readable stream_):
```sh
cat path_to_file
```
_Reading a file named with spaces in the name:_
```sh
cat 'a b c.txt'
cat ./'a b c.txt'
```
- Create empty file in current working directory:
```sh
add new_file_name
```
- Rename file (content should remain unchanged):
```sh
rn path_to_file new_filename
```
- Copy file (should be done using _Readable_ and _Writable streams_):
```sh
cp path_to_file path_to_new_directory
```
- Move file (same as copy but initial file is deleted, copying part should be done using _Readable_ and _Writable streams_):
```sh
mv path_to_file path_to_new_directory
```
- Delete file:
```sh
rm path_to_file
```
3. **Operating system info (prints following information in console)**
- Get **EOL** (default system _End-Of-Line_) and print it to console
```sh
os --EOL
```
- Get host machine CPUs info (overall amount of CPUS plus model and clock rate (in GHz) for each of them) and print it to console
```sh
os --cpus
```
- Get home directory and print it to console
```sh
os --homedir
```
- Get current _system user name_ (Do not confuse with the username that is set when the application starts) and print it to console
```sh
os --username
```
- Get CPU architecture for which Node.js binary has compiled and print it to console
```sh
os --architecture
```
4. **Hash calculation**
- Calculate hash for file and print it into console
```sh
hash path_to_file
```
5. **Compress and decompress operations**
- Compress file (using Brotli algorithm, should be done using _Streams API_)
```sh
compress path_to_file path_to_destination
```
- Decompress file (using Brotli algorithm, should be done using _Streams API_)
```sh
decompress path_to_file path_to_destination
```
_NB! After decompressing of previously compressed file result should not differ with originally compressed file_