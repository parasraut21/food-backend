
alter user 'root'@'localhost' identified with mysql_native_password by 'root123';
create database p;
use p;
create table pn (id int ,pname varchar(30) );
create table pr (CategoryName varchar(100),cname varchar(100),img text ,cdescription text );
insert into pr values ('Biryani/Rice','Chicken Fried Rice',"https://images.unsplash.com/photo-1603133872878-684f208fb84b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8Y2hpY2tlbiUyMGZyaWVkJTIwcmljZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60","Made using Indian masalas and Basmati rice. Barbequed pieces of Paneer/Chicken/Mutton were added.");
drop table pn;
insert into pn values (1,'Paras');
-- UPDATE pn SET pname="konohsvadw" WHERE id=1;
select * from pn;
select * from pr;


select*from users;

select*from resets;
TRUNCATE TABLE  resets;

ALTER TABLE foodcfofoodcategory RENAME FoodCategory ;   
select * from FoodCategory;


select*from customers;
TRUNCATE TABLE  customers;
select*from Otps;
TRUNCATE TABLE  Otps;


ALTER TABLE fooddata2 RENAME FoodDetails ; 
select * from FoodDetails; 
insert into FoodDetails values ("Starter","vadapav","https://media.istockphoto.com/photos/double-topping-pizza-on-the-wooden-desk-isolated-picture-id1074109872?k=20&m=1074109872&s=612x612&w=0&h=JoYwwTfU_mMBykXpRB_DmgeecfotutOIO9pV5_JObpk=", '{"half": "40", "full": "80"}',"aweson");