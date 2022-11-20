### Running localy
1. Run `npm install` in root directory
2. Run `npm run dev`

### Creating image
1. Run `docker build . -t <your_image_name>` in root directory

### Creating container
1. Run `docker run --name <name_of_container> -p <outer_port>:<inner_port> -e APP_PORT=8050 <name_of_image>`