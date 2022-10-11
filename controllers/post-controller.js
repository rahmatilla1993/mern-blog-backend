import PostModel from "../models/post.js";

class PostController {
  async create(req, res) {
    try {
      const doc = new PostModel({
        ...req.body,
        user: req.userId,
      });

      const post = await doc.save();
      res.status(200).json(post);
    } catch (e) {
      console.log(e);
      res.status(500).json({
        message: "Post yaratishda xatolik",
      });
    }
  }

  async addComments(req, res) {
    const comment = {
      text: req.body.text,
      postedBy: req.userId,
    };
    const { id } = req.params;
    PostModel.findByIdAndUpdate(
      { _id: id },
      {
        $push: { comments: comment },
      },
      {
        returnDocument: "after",
      },
      (err, doc) => {
        if (err) {
          console.log(err);
          res.status(500).json({
            message: "Izoh yozishda xatolik",
          });
        }
        if (!doc) {
          res.status(404).json({
            message: "Post topilmadi",
          });
        }
        res.status(200).json(doc);
      }
    )
      .populate("comments.postedBy", "_id fullName email avatarUrl")
      .populate("user", "_id fullName email avatarUrl");
  }

  async getAllTags(req, res) {
    try {
      const posts = await PostModel.find().limit(5).exec();
      const tags = posts
        .map((post) => post.tags)
        .flat()
        .slice(0, 4);
      res.status(200).json(tags);
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Post olishda xatolik",
      });
    }
  }

  async getAll(req, res) {
    try {
      const posts = await PostModel.find()
        .populate("user")
        .populate("comments.postedBy", "_id fullName email avatarUrl")
        // .populate("user", "_id email fullName")
        .exec();
      res.status(200).json(posts);
    } catch (e) {
      console.log(e);
      res.status(500).json({
        message: "Post olishda xatolik",
      });
    }
  }

  async getOne(req, res) {
    try {
      const { id } = req.params;
      PostModel.findByIdAndUpdate(
        { _id: id },
        {
          $inc: { viewsCount: 1 },
        },
        { returnDocument: "after" },
        (err, doc) => {
          if (err) {
            console.log(err);
            res.status(500).json({
              message: "Post olishda xatolik",
            });
          }
          if (!doc) {
            res.status(404).json({
              message: "Post topilmadi",
            });
          }
          res.status(200).json(doc);
        }
      )
        .populate("user", "_id fullName avatarUrl")
        .populate("comments.postedBy", "_id fullName email avatarUrl");
    } catch (e) {
      console.log(e);
      res.status(500).json({
        message: "Postlarni olishda xatolik",
      });
    }
  }

  async deletePost(req, res) {
    try {
      const { id } = req.params;
      //   await PostModel.findByIdAndRemove({ _id: id });
      //   res.status(200).json({
      //     message: "Post deleted",
      //   });
      PostModel.findByIdAndRemove({ _id: id }, (err, doc) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            message: "Post olishda xatolik",
          });
        }
        if (!doc) {
          return res.status(404).json({
            message: "Post topilmadi",
          });
        }
        res.status(200).json({
          message: "Post deleted",
        });
      });
    } catch (e) {
      console.log(e);
      res.status(500).json({
        message: "Post olishda xatolik",
      });
    }
  }

  async updatePost(req, res) {
    const { id } = req.params;
    try {
      await PostModel.updateOne(
        { _id: id },
        {
          ...req.body,
          user: req.userId,
        }
      );
      res.status(200).json({
        message: "Post yangilandi",
      });
    } catch (e) {
      console.log(e);
      res.status(500).json({
        message: "Post yangilashda xatolik",
      });
    }
  }
}

export default new PostController();
