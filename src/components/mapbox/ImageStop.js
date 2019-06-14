import stopIcon from "../../assets/stop.png";

export default {
  name: "ImageStop",
  inject: ["mapPromise"],
  async created() {
    this.map = await this.mapPromise;

    this.image = await new Promise((resolve, reject) =>
      this.map.loadImage(stopIcon, (error, image) =>
        error ? reject(error) : resolve(image)
      )
    );
    this.map.addImage("stop", this.image);
  },
  destroyed() {
    this.map.removeImage("stop");
  },
  render() {
    return null;
  }
};
