public class EditorFunction{
    
    @PostMapping("/upload")
    public void uploadImgs(@RequestParam("upload") MultipartFile file, HttpServletRequest request,HttpServletResponse response) {
        //写入文件 返回可以读取的路径
        PrintWriter out = response.getWriter();
        //错误返回
        JSONObject res=new JSONObject();
        res.put("uploaded",false);
        JSONObject error=new JSONObject();
        error.put("message","文件格式不正确（必须为.jpg/.gif/.bmp/.png文件）");

        res.put("error",error);
        out.println(res.toJSONString());
        return;
        //正确返回
        JSONObject res=new JSONObject();
        res.put("uploaded",true);
        res.put("url",cdnViewPath + fileName);
        out.println(res.toJSONString());
        return;
    }
}

    
