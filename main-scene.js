

window.Assignment_Three_Scene = window.classes.Assignment_Three_Scene =
class Assignment_Three_Scene extends Scene_Component
  { constructor( context, control_box )     // The scene begins by requesting the camera, shapes, and materials it will need.
      { super(   context, control_box );    // First, include a secondary Scene that provides movement controls:
        if( !context.globals.has_controls   ) 
          context.register_scene_component( new Movement_Controls( context, control_box.parentElement.insertCell() ) ); 

        context.globals.graphics_state.camera_transform = Mat4.look_at( Vec.of( 0,10,20 ), Vec.of( 0,0,0 ), Vec.of( 0,1,0 ) );
        this.initial_camera_location = Mat4.inverse( context.globals.graphics_state.camera_transform );

        const r = context.width/context.height;
        context.globals.graphics_state.projection_transform = Mat4.perspective( Math.PI/4, r, .1, 1000 );

        const shapes = { torus:  new Torus( 15 , 15 ),
                         torus2: new ( Torus.prototype.make_flat_shaded_version() )( 15, 15 ),

                         sun: new Subdivision_Sphere(4),
                         planet1: new (Subdivision_Sphere.prototype.make_flat_shaded_version())(2),
                         planet2: new Subdivision_Sphere(3),
                         planet3: new Subdivision_Sphere(4),
                         moon:    new (Subdivision_Sphere.prototype.make_flat_shaded_version())(1) ,
                         planet5: new ( Grid_Sphere.prototype.make_flat_shaded_version() )(15,15)


                                // TODO:  Fill in as many additional shape instances as needed in this key/value table.
                                //        (Requirement 1)
                       }
        this.submit_shapes( context, shapes );
                                     
                                     // Make some Material objects available to you:
        this.materials =
          { test:     context.get_instance( Phong_Shader ).material( Color.of( 1,1,0,1 ), { ambient:.2 } ),
            ring:     context.get_instance( Ring_Shader  ).material(),
            sun:      context.get_instance( Phong_Shader ).material( Color.of( 0,0,1,1 ), { ambient:1.0 } ),
            planet1:  context.get_instance( Phong_Shader).material(Color.of(0.424, 0.42, 0.588,1 ), {specularity:0}),
            planet2:  context.get_instance(Phong_Shader).material(Color.of(0,0.396,0,1) , {diffusivity:0.3, gouraud: 1}  ),
            planet3:  context.get_instance(Phong_Shader).material(Color.of(1, 0.56, 0, 1), {specularity:1}),

            BigBigRing: context.get_instance( Phong_Shader ).material( Color.of( 1, 0.56, 0, 1 ), { specularity: 1}),
            planet4:    context.get_instance(Phong_Shader).material(Color.of(0.26, 0.34, 0.82, 1), {specularity: 1}),

            moon:   context.get_instance(Phong_Shader).material(Color.of(0, 0.882, 0.922, 1), {specularity: 0}),
           planet5: context.get_instance( Phong_Shader ).material( Color.of( 0.85, 0.85, 0.85, 1 ) )


                                // TODO:  Fill in as many additional material objects as needed in this key/value table.
                                //        (Requirement 1)
          }

        this.lights = [ new Light( Vec.of( 5,-10,5,1 ), Color.of( 0, 1, 1, 1 ), 1000 ) ];
      }
    make_control_panel()            // Draw the scene's buttons, setup their actions and keyboard shortcuts, and monitor live measurements.
      { this.key_triggered_button( "View solar system",  [ "0" ], () => this.attached = () => this.initial_camera_location );
        this.new_line();
        this.key_triggered_button( "Attach to planet 1", [ "1" ], () => this.attached = () => this.planet_1 );
        this.key_triggered_button( "Attach to planet 2", [ "2" ], () => this.attached = () => this.planet_2 ); this.new_line();
        this.key_triggered_button( "Attach to planet 3", [ "3" ], () => this.attached = () => this.planet_3 );
        this.key_triggered_button( "Attach to planet 4", [ "4" ], () => this.attached = () => this.planet_4 ); this.new_line();
        this.key_triggered_button( "Attach to planet 5", [ "5" ], () => this.attached = () => this.planet_5 );
        this.key_triggered_button( "Attach to moon",     [ "m" ], () => this.attached = () => this.moon     );
      }
    display( graphics_state )
      { graphics_state.lights = this.lights;        // Use the lights stored in this.lights.
        const time_rot = graphics_state.animation_time / 1000, dt = graphics_state.animation_delta_time / 1000;


        //SUN
        let model_transform = Mat4.identity();
        let scale = 2+Math.cos(time_rot*2*Math.PI/5);
        let radius = Math.cos(time_rot*2*Math.PI/5);
        let red = 0.11+radius, green = radius-0.87, blue = radius - 0.72;
        if ( red < 0.25){
          red = 0.25;
        }
        if( blue < 0.50){
          blue = 0.50;
        }
        let sun_color = Color.of( red, green, blue, 1); 
        // let sun_color = Color.of( 1, 1, 1, 1); 
        this.lights = [ new Light( Vec.of( 0,0,0,1 ), sun_color, 10**scale ) ];
        model_transform  = model_transform.times( Mat4.scale ([ scale, scale, scale]));

        


        graphics_state.lights = this.lights;
        this.shapes.sun.draw ( graphics_state, model_transform, this.materials.sun.override({ color: sun_color }) );


        let j = 5, change = 3;
        //Planet_1
        model_transform = Mat4.identity();
        model_transform = model_transform .times(Mat4.rotation(time_rot, Vec.of(0,1,0)))
                                          .times( Mat4.translation([ j, 0, 0 ]) )
                                          .times(Mat4.rotation(time_rot, Vec.of(0,1,0)));


        this.planet_1 = model_transform;
        this.shapes.planet1.draw(graphics_state, model_transform,this.materials.planet1);


        //Planet_2 
       j+= change ;
       let rotateSunSpeed1 = 0.7 * time_rot;
       model_transform = Mat4.identity();
       model_transform = model_transform.times(Mat4.rotation(rotateSunSpeed1, Vec.of(0,1,0)))
                                        .times(Mat4.translation([j,0,0]))
                                        .times(Mat4.rotation(rotateSunSpeed1, Vec.of(0,1,0)));



        this.planet_2 = model_transform;
        
        switch(time_rot%2){
          case 0:
                this.shapes.planet2.draw(graphics_state, model_transform, this.materials.planet2);
                break;
          default:
                this.shapes.planet2.draw(graphics_state, model_transform, this.materials.planet2.override({gouraud: 1  }));
                break;
          }
        

         //Planet_3
        j += change ;
        rotateSunSpeed1 = 0.6 * time_rot;
        model_transform = Mat4.identity();
        model_transform = model_transform.times(Mat4.rotation(rotateSunSpeed1, Vec.of(0,1,0)))
                                         .times(Mat4.translation([j,0,0]))
                                         .times(Mat4.rotation(rotateSunSpeed1, Vec.of(1,1,0)));

      this.planet_3 = model_transform;
      this.shapes.planet3.draw(graphics_state, model_transform, this.materials.planet3);
      let multiRing = Mat4.identity(); 
      model_transform = model_transform. times(Mat4.scale([1,1, 0.1]));



      this.shapes.torus.draw( graphics_state, model_transform, this.materials.ring);

      j+= change ;
      
      //planet_4
      rotateSunSpeed1 = 0.5 *time_rot ;
      model_transform =Mat4.identity();
      model_transform = model_transform.times(Mat4.rotation(rotateSunSpeed1, Vec.of(0,1,0)))
                                       .times(Mat4.translation([j,0,0]))
                                       .times(Mat4.rotation(rotateSunSpeed1, Vec.of(0,1,0)));

      this.planet_4= model_transform;

       this.shapes.planet3.draw(graphics_state,model_transform, this.materials.planet4);

      //Moon
      rotateSunSpeed1 = 0.9 *time_rot;
      model_transform = model_transform.times(Mat4.rotation(rotateSunSpeed1, Vec.of(0,1,0)))
                                       .times(Mat4.translation([2,0,0]));

      this.moon = model_transform;
      this.shapes.moon.draw(graphics_state,model_transform, this.materials.moon);

      j+= change ;
      rotateSunSpeed1 = 0.4 *time_rot ;
      model_transform =Mat4.identity();
      model_transform = model_transform.times(Mat4.rotation(rotateSunSpeed1, Vec.of(0,1,0)))
                                       .times(Mat4.translation([j,0,0]))
                                       .times(Mat4.rotation(rotateSunSpeed1, Vec.of(0,1,0)));
      this.planet_5 = model_transform;
      this.shapes.planet5.draw(graphics_state,model_transform, this.materials.planet5);


       if (typeof this.attached != 'undefined')
        {
          let desired = Mat4.inverse( this.attached().times( Mat4.translation([ 0, 0, 5 ]) ) );
          graphics_state.camera_transform = desired.map( (x,i) => Vec.from( graphics_state.camera_transform[i] ).mix( x, .1 ) );
        }

  }

}
// Extra credit begins here (See TODO comments below):

window.Ring_Shader = window.classes.Ring_Shader =
class Ring_Shader extends Shader              // Subclasses of Shader each store and manage a complete GPU program.
{ material() { return { shader: this } }      // Materials here are minimal, without any settings.
  map_attribute_name_to_buffer_name( name )       // The shader will pull single entries out of the vertex arrays, by their data fields'
    {                                             // names.  Map those names onto the arrays we'll pull them from.  This determines
                                                  // which kinds of Shapes this Shader is compatible with.  Thanks to this function, 
                                                  // Vertex buffers in the GPU can get their pointers matched up with pointers to 
                                                  // attribute names in the GPU.  Shapes and Shaders can still be compatible even
                                                  // if some vertex data feilds are unused. 
      return { object_space_pos: "positions" }[ name ];      // Use a simple lookup table.
    }
    // Define how to synchronize our JavaScript's variables to the GPU's:
  update_GPU( g_state, model_transform, material, gpu = this.g_addrs, gl = this.gl )
      { const proj_camera = g_state.projection_transform.times( g_state.camera_transform );
                                                                                        // Send our matrices to the shader programs:
        gl.uniformMatrix4fv( gpu.model_transform_loc,             false, Mat.flatten_2D_to_1D( model_transform.transposed() ) );
        gl.uniformMatrix4fv( gpu.projection_camera_transform_loc, false, Mat.flatten_2D_to_1D(     proj_camera.transposed() ) );
      }
  shared_glsl_code()            // ********* SHARED CODE, INCLUDED IN BOTH SHADERS *********
    { return `precision mediump float;
              varying vec4 position;
              varying vec4 center;
      `;
    }
  vertex_glsl_code()           // ********* VERTEX SHADER *********
    { return `
        attribute vec3 object_space_pos;
        uniform mat4 model_transform;
        uniform mat4 projection_camera_transform;

        void main()
        { 
          gl_Position = projection_camera_transform * model_transform * vec4(object_space_pos, 1.0); 
          position = model_transform * vec4(object_space_pos, 1.0) ;
          center = model_transform * vec4(0, 0, 0, 1.0) ;

        }`;           // TODO:  Complete the main function of the vertex shader (Extra Credit Part II).
    }
  fragment_glsl_code()           // ********* FRAGMENT SHADER *********
    { return `
        void main()
        { 
          if (distance(position, center) <= 2.5)
          {
            if (sin(28.0 * distance(position, center)) > -0.4)
              gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
            else
              gl_FragColor = vec4(0.65, 0.4, 0.05, 1.0); 
          }  
        }`;           // TODO:  Complete the main function of the fragment shader (Extra Credit Part II).
    }
}

window.Grid_Sphere = window.classes.Grid_Sphere =
class Grid_Sphere extends Shape           // With lattitude / longitude divisions; this means singularities are at 
  { constructor( rows, columns, texture_range )             // the mesh's top and bottom.  Subdivision_Sphere is a better alternative.
      { super( "positions", "normals", "texture_coords" );
        
        const circle_points = Array( rows ).fill( Vec.of( 0,0,1 ) )
                                           .map( (p,i,a) => Mat4.translation([ 0,0,0 ])
                                                    .times( Mat4.rotation( i/(a.length-1) * Math.PI, Vec.of( 0,-1,0 ) ) )
                                                    .times( p.to4(1) ).to3() );

        Surface_Of_Revolution.insert_transformed_copy_into( this, [ rows, columns, circle_points ] );   
                      // TODO:  Complete the specification of a sphere with lattitude and longitude lines
                      //        (Extra Credit Part III)
      } }