# Compile sample

hello.py:
```python

def main():
    puts("Hello, world")
    
```

```
node compile hello.py > hello.c
```

It generates hello.c:
```c

int main()
{
    puts("Hello, world");
}
 
```

Compile with:
```
gcc hello.c
```
