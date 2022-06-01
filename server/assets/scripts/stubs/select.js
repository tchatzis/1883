export async function load()
{
    let scope = this;    
    let parent = scope.getParent();

    scope.form =
    {
        id: null,
        element: null,
        parent: parent,
        widgets: {}
    };
};