
Backend


Base de Datos.

En este caso no se construyó una base de datos manualmente ya que utilizamos EntityFramework para que por medio de migrations se cree la base de datos,las tablas User y Roles en esta ultima tabla se crean dos roles Admin y User.


El proyecto AuthWebApiPrueba, consiste en el manejo de autorización, autenticación y roles de los usuarios realizados en C# ASP.NET Core Web API versión .NET 9.0.
1._ Para poder trabajar con el backend necesitamos descargar o clonar los archivos que de encuentran en GitHub en el siguiente link https://github.com/MicaelaSalvador/PruebAuthUser-NetCore8-Angular19,  nos  aparecerá una pantalla como la siguiente.
 
Si lo quieres clonar solo necesita abrir una consola de Windows PowerShell, ubicarte en una carpeta o el lugar donde quieras clonarlo como en el siguiente ejemplo.
PS C:\Users\Asus Vivobook S\Desktop> git  clone https://github.com/MicaelaSalvador/PruebAuthUser-NetCore8-Angular19.git
En este caso yo me ubiqué en el escritorio puse git clone y el link que aparece en el recuadro marcado con azul solo se debe dar un click y se copia  automáticamente .
Después de realizar un clon aparecerán dos carpetas.
   
Uno es el backend llamado AuthWebApiPrueba, el otro es el frontend que en la parte del frontend te lo explico.
Si lo quieres descargar solo ve a link del proyecto en GitHub dar click  en code posteriormente descargar posteriormente debes descomprimirlo y es lo mismo  aparecerá dos  carpetas uno es el backend  y el otro el frontend como lo explique anteriormente.
2.- Lo primero que debes realizar es cambiar la conexión a MySQL dependiendo de la conexión local o remota con la que cuentas, en este caso yo me conecto a mi conexión local y la contraseña indicada.
Como comentario, estoy trabajando con MySQL Workbench 8.0 CE para realizar los ejemplos.
Nota. Si utilizas XAMPP o algo parecido, es lo mismo realiza los mismos pasos para realizar la conexión, pequeña diferencia, pero no afecta la realización de cada uno de los procedimientos es que estos servidores utilizan MariaDB.   
  
3._Teniendo los datos anteriores debemos abrir la carpeta AuthWebApiPrueba con el ID de su preferencia, en este caso estoy trabajando con Visual Studio Code, si aún no lo tienes instalado y quieres trabajar de esta manera te dejo el link de instalación https://code.visualstudio.com/download, solo tienes que elegir el sistema operativo con la que cuentas, descargarlo e instalarlo. 
Ya teniendo el proyecto AuthWebApiPrueba descargada y descomprimida o clonada que realizamos en el paso número uno, debemos abrir Visual Studio Code, a veces al abrir por primera vez Visual Studio Code muestra un mensaje ¿confía en los autores de los archivos de esta carpeta? Debemos seleccionar la opción Si, confió en los autores carpeta de confianzas y habilitar todas las funciones, con el anterior paso te quedará una pantalla como te muestro en la siguiente imagen.
  

Arrastra la carpeta del proyecto AuthWebApiPrueba y te aparecerá algo como en la siguiente Imagen.
 
Debes ir al Explorer o explorador, localizar el nombre del proyecto en este caso es AuthWebApiPrueba posteriormente debes expandirlo con la flecha, a continuación localiza y da click en appsettings.json , cambia de acuerdo a tus  datos de  conexión que obtuviste  en el paso  anterior.
4.- Pasos para realizar una Migración,

Los siguientes pasos realízalos solo si estás trabajando con visual Studio.  

 Debes abrir visual studio dar click en abrir un proyecto o solución seleccionar la ubicación del proyecto AuthWebApiPrueba que clonamos o descargamos y descomprimimos anteriormente, revisar si en nuestro proyecto que no exista una carpeta llamada Migrations, si existe la carpeta dar click derecho sobre ella y seleccionar la opción Delete para eliminarla.
Ahora que ya tienes el proyecto AuthWebApiPrueba abierto con Visual studio 2022, te doy como referencia Visual Studio 2022 Versión 17.12.3 porque por defecto instala la versión .NET 9.0 la versión más reciente, debe localizar la opción Tools posteriormente – NuGet Package Management después   -Package Magagement Consola, aquí abrirá una consola en la que pondrás el siguiente código.
Add-Migration InitialCreate, después de que termine la ejecución ejecutar la siguiente línea de   código Update-Database, con la ejecución de estas dos líneas de código y si la conexión a la base de datos es correcta se creará una carpeta en el proyecto AuthWebApiPrueba llamado Migrations  y en  MySQL creará una  base de datos llamado  AuthUserDb  con dos tablas llamadas roles y Users, también se crean  dos roles en la tabla roles llamadas Admin,User.

Los siguientes pasos realízalos solo si estás trabajando con visual studio code.

Ahora ya podemos continuar con la Migración, debes abrir visual Studio Code y arrastrar la carpeta del proyecto AuthWebApiPrueba como te muestro en pasos anteriores, revisar si tienes la carpeta Migrations, si lo localizas click derecho sobre la carpeta posteriormente debes localizar la opción Delete para eliminarlo.
Después de haber realizado los pasos anteriores debes localizar la pestaña Terminal si no lo localizas da click sobre … ahí veras la pestaña terminal dar click sobre ella y posteriormente New Terminal, sobre esa terminal que abrió poner la siguiente línea de código dotnet ef migrations add InitialCreate, cuando termine la ejecución poner la siguiente línea de código dotnet ef database update , con la ejecución de estas dos líneas de código y si la conexión a la base de datos es correcta se creará una carpeta en el proyecto AuthWebApiPrueba llamado Migrations  y en  MySQL creará una  base de datos llamado  AuthUserDb  con dos tablas llamadas roles y Users, también se crean  dos roles en la tabla roles llamadas Admin,User.
5.- Configuración del Cors, esto nos permite hacer solicitudes a una aplicación Web de un dominio diferente.
En este caso por defecto el frontend se ejecuta en  http://localhost:4200 , si al correr el frontend se ejecuta   en un localhost diferente.
Debes ir al  Program,cs del proyecto  AuthWebApiPrueba  y debes  cambiar al localhost que te  muestra el frontend.
 
6._ Después de seguir estos pasos ya podemos ejecutar el proyecto. Si el  proyecto lo abriste  con visual studio  code  debes  ir  a la  parte del menú , darle  click a  los tres  puntitos  y seleccionar  Nueva Terminal,  como se muestra en la imagen.
 
Ya que tenemos la terminal abierta debemos escribir la siguiente línea de código.
- dotnet watch.
Si se ejecutó correctamente debemos ver una pantalla como  esta.
 
 
FrontEnd

1._En el caso del frontend ya los descargamos en los primeros pasos que realizamos al principio, la carpeta se llama Auth_Angular19.
 
En este caso para revisar el contenido del frontend debemos   abrir visual studio code(VSC)  y arrastrar la carpeta a la  pantalla de Visual Studio  Code.
2._Abrimos una nueva terminal como ya lo hicimos en  pasos  anteriores, ir al menú de  Visual studio  code, dar click en  los tres  puntitos, posteriormente  debes  seleccionar Terminal  por ultimo  New Terminal. Sobre esa terminal que se abrió debemos poner la siguiente  línea de código. 
-npm Install
Con este comando se creará una carpeta en nuestro proyecto Frontend llamado node-modules.
3.-Posteriormente localizar dentro del proyecto la carpeta de environments , dar click  sobre enviroment.development.ts, revisar que el backend  este corriendo  en el mismo localhost que  el enviroment.development.ts  indica de  lo contrario  cambiarlo  al localhost  que tiene el backend.
 

4._ Para ejecutar el proyecto, si no tienes abierto una consola debes ir al menú principal, dar click sobre los tres puntitos posteriormente debes seleccionar Terminal, en seguida nueva terminal.
Sobre esa terminal que se abrió debes poner la siguiente línea de código. 
- ng serve –open
Si todo esta correcto debes ver una pantalla como te nuestro en la imagen.
Esta es una pantalla para el login.
 

Si seleccionamos Sign Up nos aparecerá la pantalla para registrarse.
 
