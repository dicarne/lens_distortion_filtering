var list = [{a:1,b:0},{a:2,b:2},{a:3,b:12}];
console.log(list.reduce((p,c)=>p+c.a,0));