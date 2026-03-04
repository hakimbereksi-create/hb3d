$(document).ready(function(){
    // Variable to store your files
    var files;

    // Add events
    $('input[type=file]').on('change', prepareUpload);
    $("#loading").hide();

    // Grab the files and set them to our variable
    function prepareUpload(event)
    {
        files = event.target.files;
        console.log("FILE added to upload queue.");
    }

    $('#submit').on('click', uploadFiles);

function uploadFiles(event)
{
    event.stopPropagation();
    event.preventDefault();
    
    // FIX : Vérifie files existe
    if (!files || files.length === 0) {
        alert('❌ Aucun fichier STL chargé !');
        $("#loading").hide();
        return;
    }
    
    $("#loading").show();
    var data = new FormData();
        $.each(files, function(key, value){
            data.append(key, value);
            console.log(value);
        });

        $.ajax({
            url: './php/upload.php?files',
            type: 'POST',
            data: data,
            cache: false,
            dataType: 'json',
            processData: false,
            contentType: false,
            success: function(data, textStatus, jqXHR)
            {
                if(typeof data.error === 'undefined')
                {
                    submitForm(event, data);
                }
                else
                {
                    console.log('1.ERRORS: ' + data.error);
                    $("#loading").hide();
                }
            },
            error: function(jqXHR, textStatus, errorThrown)
            {
                console.log('2.ERRORS détaillées:', errorThrown);
                console.log('Status:', jqXHR.status);
                console.log('Response:', jqXHR.responseText);
                $("#loading").hide();
                alert('Upload KO → Status ' + jqXHR.status + ' → Crée php/upload.php !');
            }
        });
    }

    function submitForm(event, data)
    {
        $form = $("#form");
        var formData = $form.serialize();

        $.each(data.files, function(key, value){
            formData = formData + '&filenames[]=' + value;
        });

        $.ajax({
            url: './php/submit.php',
            type: 'POST',
            data: formData,
            cache: false,
            dataType: 'json',
            success: function(data, textStatus, jqXHR)
            {
                if(typeof data.error === 'undefined')
                {
                    console.log('SUCCESS: ' + data.success);
                }
                else
                {
                    console.log('1.ERRORS: ' + data.error);
                }
            },
            error: function(jqXHR, textStatus, errorThrown)
            {
                console.log('2.ERRORS: ' + errorThrown);
            },
            complete: function()
            {
                $("#loading").hide();
                alert("Your 3D printing order is now in our queue :) \n Thank you.");
            }
        });
    }
});
