import IdeaModel from "../Models/IdeaModel.js";
import EntrepreneurModel from "../Models/EntrepreneurModel.js";

// Post an Idea
const postIdea = async (req, res) => {
  const {
    title,
    description,
    category,
    estimatedInvestment,
    equity,
    isPatent,
    patentId,
    businessStage,
    Entrepreneur,
  } = req.body;

  if (
    !title ||
    !description ||
    !category ||
    !estimatedInvestment ||
    !isPatent ||
    !businessStage ||
    !Entrepreneur
  ) {
    return res
      .status(400)
      .json({ status: "failed", message: "Please fill all the fields" });
  }

  try {
    const newIdea = new IdeaModel({
      title,
      description,
      category,
      estimatedInvestment,
      equity,
      isPatent,
      patentId,
      businessStage,
      Entrepreneur,
    });
    await newIdea.save();
    await EntrepreneurModel.findByIdAndUpdate(
      { _id: Entrepreneur },
      {
        $push: { Ideas: newIdea._id },
      }
    );
    console.log(Entrepreneur);
    res
      .status(200)
      .json({ status: "success", message: "Idea Posted Successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ status: "failed", message: "Internal Server Error" });
  }
};

// Get all Ideas
const getIdeas = async (req, res) => {
  try {
    const ideas = await IdeaModel.find()
      .populate("Entrepreneur")
      .sort({ createdAt: -1 });
    res.status(200).json({ status: "success", data: ideas });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: "failed", message: "Internal Server Error" });
  }
};

// Get User Ideas
const getUserIdeas = async (req, res) => {
  const { userId } = await req.params;
  try {
    const user = await EntrepreneurModel.findById(userId).populate({
      path: "Ideas",
      options: { sort: { createdAt: -1 } }, // Sort Ideas by latest first
    });
    res.status(200).json({ status: "success", data: user });
  } catch (error) {
    res
      .status(500)
      .json({ status: "failed", message: "Internal Server Error" });
  }
};

// Update User Idea
const updateIdea = async (req, res) => {
  const { ideaId } = req.params;
  const ideaData = req.body;
  if (ideaData.isPatent === "No") {
    ideaData.patentId = "";
  }

  try {
    const updatedIdea = await IdeaModel.findByIdAndUpdate(
      ideaId,
      { $set: ideaData },
      { new: true, runValidators: true }
    );
    await updatedIdea.save();
    console.log("Done");
    res
      .status(200)
      .json({ status: "success", message: "Idea Updated Successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ status: "failed", message: "Internal Server Error" });
  }
};

// Delete User Idea
const deleteIdea = async (req, res) => {
  const { ideaId } = req.params;
  try {
    const deletedIdea = await IdeaModel.findByIdAndDelete(ideaId);
    await EntrepreneurModel.findByIdAndUpdate(
      { _id: deletedIdea.Entrepreneur },
      {
        $pull: { Ideas: ideaId },
      }
    );
    res
      .status(200)
      .json({ status: "success", message: "Idea Deleted Successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ status: "failed", message: "Internal Server Error" });
  }
};

export { postIdea, getIdeas, getUserIdeas, updateIdea, deleteIdea };
