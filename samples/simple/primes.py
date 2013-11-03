
def isprime(n):
    k = 3
    
    while k * k <= n:
        if n % k == 0:
            return
            
    printf("%d is prime", n)
    
    
def main():
    n = 3
    
    while n < 100:
        isprime(n)
        n = n + 2
