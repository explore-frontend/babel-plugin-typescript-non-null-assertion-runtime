const a = {
    b: 1,
};

a!.b = 1;
a.b! = 2;
const c = a!.b;
const d = a.b!;