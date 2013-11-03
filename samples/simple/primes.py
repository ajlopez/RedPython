
def isprime(n):
    k = 3
    
    while k * k <= n:
        if n % k == 0:
            return 0
        k = k + 2
            
    printf("%d is prime\n", n)
    
    
def main():
    n = 3
    
    while n < 100:
        isprime(n)
        n = n + 2
